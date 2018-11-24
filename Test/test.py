import pandas as pd

filename = "80393ned_UntypedDataSet_21112018_163013.csv"

def open_csv(filename):
    df = pd.read_csv(filename, sep=';')
    print(df.columns)
    print(df['Perioden'])


if __name__ == '__main__':
    open_csv(filename)
