from sqlalchemy import create_engine, text

engine = create_engine("mysql+pymysql://root:Phiphi05@localhost:3306/webkhaosat?charset=utf8mb4")

def load_detai():
    with engine.connect() as conn:
        result = conn.execute(text("select * from detai"))
        detais = []
        for row in result.all():
            detais.append(row._asdict())
        return detais