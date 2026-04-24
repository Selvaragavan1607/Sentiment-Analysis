"""SQLite storage for sentiment history."""
import sqlite3
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).parent / "sentiment.db"


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                processed_text TEXT,
                sentiment TEXT NOT NULL,
                confidence REAL NOT NULL,
                timestamp TEXT NOT NULL
            )
        """)


def save_analysis(text, processed_text, sentiment, confidence):
    with get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO analyses (text, processed_text, sentiment, confidence, timestamp) VALUES (?,?,?,?,?)",
            (text, processed_text, sentiment, float(confidence), datetime.utcnow().isoformat()),
        )
        return cur.lastrowid


def get_all():
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM analyses ORDER BY id DESC").fetchall()
        return [dict(r) for r in rows]


def search(q):
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM analyses WHERE text LIKE ? OR sentiment LIKE ? ORDER BY id DESC",
            (f"%{q}%", f"%{q}%"),
        ).fetchall()
        return [dict(r) for r in rows]


def delete_one(item_id):
    with get_conn() as conn:
        conn.execute("DELETE FROM analyses WHERE id=?", (item_id,))


def delete_all():
    with get_conn() as conn:
        conn.execute("DELETE FROM analyses")
