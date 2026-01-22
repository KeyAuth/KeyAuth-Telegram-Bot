import { Database } from "bun:sqlite";
import fs from "fs";
import path from "path";

export class BunDB {
  private db: Database;

  constructor(filename: string) {
    // Ensure directory exists
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    this.db = new Database(filename);
    
    // Check for legacy "json" table (from quick.db v7/v8 or similar)
    const tables = this.db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='json'").all();
    
    // Create new table
    this.db.run("CREATE TABLE IF NOT EXISTS key_value (key TEXT PRIMARY KEY, value TEXT)");
    
    if (tables.length > 0) {
        // Migration logic
        console.log("[BunDB] Detected legacy 'json' table. Checking for data to migrate...");
        
        // Check if there is data in the json table
        // @ts-ignore
        const legacyRowCount = this.db.query("SELECT COUNT(*) as count FROM json").get()?.count || 0;
        
        if (legacyRowCount > 0) {
             console.log(`[BunDB] Found ${legacyRowCount} rows in 'json' table. Migrating to 'key_value'...`);
             
             try {
                 const rows = this.db.query("SELECT * FROM json").all();
                 const insertStmt = this.db.prepare("INSERT OR IGNORE INTO key_value (key, value) VALUES (?, ?)");
                 
                 const transaction = this.db.transaction((rows: any[]) => {
                    for (const row of rows) {
                        try {
                            // Check for monolithic keys that need splitting
                            if (["applications", "selectedapp", "masks"].includes(row.ID)) {
                                console.log(`[BunDB] Splitting monolithic key: ${row.ID}`);
                                const data = JSON.parse(row.json);
                                for (const userId in data) {
                                    if (Object.prototype.hasOwnProperty.call(data, userId)) {
                                        const newKey = `${row.ID}.${userId}`;
                                        const newValue = JSON.stringify(data[userId]);
                                        insertStmt.run(newKey, newValue);
                                    }
                                }
                            } else {
                                // Standard migration for other keys
                                if (row.ID && row.json) {
                                    insertStmt.run(row.ID, row.json);
                                }
                            }
                        } catch (e) {
                            console.error(`[BunDB] Error migrating row ${row.ID}:`, e);
                        }
                    }
                 });
                 
                 transaction(rows);
                 console.log("[BunDB] Migration completed successfully.");
             } catch (error) {
                 console.error("[BunDB] Migration failed:", error);
             }
        }
    }
  }

  async get(key: string): Promise<any> {
    const result = this.db.query("SELECT value FROM key_value WHERE key = ?").get(key) as { value: string } | null;
    if (!result) return null;
    try {
      return JSON.parse(result.value);
    } catch {
      return result.value;
    }
  }

  async set(key: string, value: any): Promise<void> {
    const stringValue = JSON.stringify(value);
    this.db.run("INSERT OR REPLACE INTO key_value (key, value) VALUES (?, ?)", [key, stringValue]);
  }

  async delete(key: string): Promise<void> {
    this.db.run("DELETE FROM key_value WHERE key = ?", [key]);
  }

  async has(key: string): Promise<boolean> {
    const result = this.db.query("SELECT 1 FROM key_value WHERE key = ?").get(key);
    return !!result;
  }
}
