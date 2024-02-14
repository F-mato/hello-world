import pandas as pd
import sqlite3
import os

# 指定された絶対パス
#filename = r"\\RSFukuokaTS6600\\7D\\9_個人制作\\的野\\自動販売機\\自動販売機完成版.xlsm"
filename = "自動販売機完成版.xlsm"
# Excelファイルからデータを読み込む
df = pd.read_excel(filename, sheet_name='sheet2', usecols="A,D")

# データを表示
print(df)


# 新しいSQLiteデータベースに接続（存在しない場合は作成される）
conn = sqlite3.connect('jihanki.db')

# データベースにテーブルを作成（既に存在する場合はこのステップをスキップ）
cur = conn.cursor()
cur.execute('''
CREATE TABLE IF NOT EXISTS inventory (
    商品ID INTEGER PRIMARY KEY,
    在庫 INTEGER NOT NULL
);
''')
conn.commit()

# DataFrameのデータをSQLiteデータベースに挿入
# ExcelファイルのA列が商品ID、D列が在庫として想定されています
df.to_sql('inventory', conn, if_exists='replace', index=False)

# データベース接続を閉じる
conn.close()
