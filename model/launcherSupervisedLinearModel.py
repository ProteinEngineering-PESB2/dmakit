
from modulesProject.linear_regression import execLinearModel
from modulesProject.dataBase_module import ConnectDataBase
from modulesProject.dataBase_module import HandlerQuery

import pandas as pd
import sys

#recibimos los datos de entrada...
dataSet = pd.read_csv(sys.argv[1])
user = sys.argv[2]
job = sys.argv[3]
pathResponse = sys.argv[4]
algorithm = int(sys.argv[5])
featureClass = sys.argv[6]
optionNormalize = int(sys.argv[7])

#hacemos la instancia del obeto...
execProcess = execLinearModel.execProcess(dataSet, user, job, pathResponse, algorithm, featureClass, optionNormalize)
execProcess.execAlgorithmByOptions()#hacemos la ejecucion del algoritmo con respecto a la data que se entrego

#cambiamos el estado al job
connectDB = ConnectDataBase.ConnectDataBase()
handler = HandlerQuery.HandlerQuery()

#hacemos la consulta
query = "update job set job.statusJob = 'FINISH', job.modifiedJob= NOW() where job.idjob=%s" % job

connectDB.initConnectionDB()
handler.insertToTable(query, connectDB)
connectDB.closeConnectionDB()
