import pandas as pd

FILE_IN = "../Data/Gecombineerde_data_1999-2018.csv"
FILE_OUT = "../Data/Gecombineerde_data_1999-2018_aangepast.tsv"

def import_csv(filename):
    df = pd.read_csv(filename, sep=';')
    # print(df)
    return df

def process_data(df):

    for year in range(1999, 2019):
        # print(df["1999"])
        x = str(year)
        df[x].mask((df[x] > 2000), inplace=True)

    # print(df)
    return df


def create_different_years(df):

    list = []
    for year in range(1999, 2019):
        titel = df["Titel"].tolist()
        artiest = df["Artiest"].tolist()
        jaar = df["Jaar"].tolist()
        notering = df[str(year)].tolist()

        dataframe = pd.DataFrame(
            {'Lijst': year,
             'Notering': notering,
             'Titel': titel,
             'Artiest': artiest,
             'Jaar': jaar,
             })
        dataframe.sort_values('Notering', inplace=True)
        dataframe.dropna(inplace=True)
        dataframe2 = dataframe["Notering"].astype(int)

        dataframe["Notering"] = dataframe2
        # print(dataframe)

        # dataframe.to_csv(f"../Data/{year}.tsv", index=False, sep="\t")
        list.append(dataframe)
    print(list)
    result = pd.concat(list)
    print(result)
    # result.to_csv(f"../Data/merged_list.tsv", index=False, sep="\t")
    return result


def create_json_titels(df):

    print(df)

    list = []
    for i in range(1999, 2019):
        x = str(i)
        list.append(x)

    print(list)
    j = (df.groupby(['Artiest', 'Titel', 'Jaar', 'HP'], as_index=False)
             .apply(lambda x: x[list].to_dict('r'))
             .reset_index()
             .rename(columns={0: 'Noteringen'}))

    print(j)

    k = (j.groupby("Artiest", as_index=True)
          .apply(lambda x: x[["Titel", "Jaar", "HP", "Noteringen"]].to_dict("r"))
          .reset_index()
          .rename(columns={0: "Titels"})
          .to_json("../Data/titels.json", orient='records'))

    print(k)


def create_json_artist(df):

    print(df)
    j = (df.groupby(["Artiest", "Lijst"], as_index=False)
          .apply(lambda x: x[["Titel", "Jaar", "Notering"]].to_dict('r'))
          .reset_index()
          .rename(columns={0: 'Data'}))

    k = (j.groupby("Artiest", as_index=True)
          .apply(lambda x: x[["Lijst", "Data"]].to_dict("r"))
          .reset_index()
          .rename(columns={0: "TOP2000JAAR"})
          .to_json("../Data/artiesten.json", orient='records'))

    print(k)



def create_csv(df):
    df.to_csv(FILE_OUT, index=False, sep="\t")

if __name__ == '__main__':
    df = import_csv(FILE_IN)
    df = process_data(df)


    # create_json_titels(df)
    x = create_different_years(df)
    create_json_artist(x)
    # create_csv(df)
