import pandas as pd
import psython as psy



def phantichfile(filename):
  df = pd.read_excel(filename)
  cronbach = psy.cronbach_alpha_scale_if_deleted(df)
  data = [df, cronbach]
  return data




