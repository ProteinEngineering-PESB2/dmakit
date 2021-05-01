'''
script que permite ejecutar todos los algoritmos con distintas variaciones para generar
clasificadores y sus respectivos modelos, almacena en un archivo csv la data que se genera con
respecto a las diversas medidas que se obtienen como resultado del proceso...
'''

import sys
import pandas as pd
import numpy as np
import time
import datetime
import json

from modulesProject.supervised_learning_predicction import AdaBoost
from modulesProject.supervised_learning_predicction import Baggin
from modulesProject.supervised_learning_predicction import DecisionTree
from modulesProject.supervised_learning_predicction import Gradient
from modulesProject.supervised_learning_predicction import knn_regression
from modulesProject.supervised_learning_predicction import MLP
from modulesProject.supervised_learning_predicction import NuSVR
from modulesProject.supervised_learning_predicction import RandomForest
from modulesProject.supervised_learning_predicction import SVR

from modulesProject.statistics_analysis import summaryStatistic

from modulesProject.dataBase_module import ConnectDataBase
from modulesProject.dataBase_module import HandlerQuery
from modulesProject.utils import sendEmail

#utils para el manejo de set de datos y su normalizacion
from modulesProject.utils import transformDataClass
from modulesProject.utils import transformFrequence
from modulesProject.utils import ScaleNormalScore
from modulesProject.utils import ScaleMinMax
from modulesProject.utils import ScaleDataSetLog
from modulesProject.utils import ScaleLogNormalScore

#para evaluar la performance
from modulesProject.supervised_learning_predicction import performanceData

#funcion que permite calcular los estadisticos de un atributo en el set de datos, asociados a las medidas de desempeno
def estimatedStatisticPerformance(summaryObject, attribute):

    statistic = summaryObject.calculateValuesForColumn(attribute)
    row = [attribute, statistic['mean'], statistic['std'], statistic['var'], statistic['max'], statistic['min']]

    return row

#recibimos los parametros desde la terminal...
user = sys.argv[1]
job = sys.argv[2]
dataSet = pd.read_csv(sys.argv[3])
pathResponse = sys.argv[4]
emailUser = sys.argv[5]
nameUser = sys.argv[6]

#valores iniciales
start_time = time.time()
inicio = datetime.datetime.now()
iteracionesCorrectas = 0
iteracionesIncorrectas = 0

#procesamos el set de datos para obtener los atributos y las clases...
columnas=dataSet.columns.tolist()
x=columnas[len(columnas)-1]
targetResponse=dataSet[x]#clases
y=columnas[0:len(columnas)-1]
dataValues=dataSet[y]#atributos

#transformamos la clase si presenta atributos discretos
transformData = transformDataClass.transformClass(targetResponse)
target = transformData.transformData

#ahora transformamos el set de datos por si existen elementos discretos...
transformDataSet = transformFrequence.frequenceData(dataValues)
dataSetNewFreq = transformDataSet.dataTransform

#ahora aplicamos el procesamiento segun lo expuesto
applyNormal = ScaleNormalScore.applyNormalScale(dataSetNewFreq)
data = applyNormal.dataTransform

#generamos una lista con los valores obtenidos...
header = ["Algorithm", "Params", "R_Score", "Pearson", "Spearman", "Kendalltau"]
matrixResponse = []

#comenzamos con las ejecuciones...

#AdaBoost
for loss in ['linear', 'squar', 'exponential']:
    for n_estimators in [10,50,100,200,500,1000,1500,2000]:
        try:
            print ("Excec AdaBoostRegressor with {} - {}".format(loss, n_estimators))
            AdaBoostObject = AdaBoost.AdaBoost(data, target, n_estimators, loss)
            AdaBoostObject.trainingMethod()

            #obtenemos el restante de performance
            performanceValues = performanceData.performancePrediction(target, AdaBoostObject.predicctions.tolist())
            pearsonValue = performanceValues.calculatedPearson()['pearsonr']
            spearmanValue = performanceValues.calculatedSpearman()['spearmanr']
            kendalltauValue = performanceValues.calculatekendalltau()['kendalltau']

            params = "loss:%s-n_estimators:%d" % (loss, n_estimators)
            row = ["AdaBoostClassifier", params, AdaBoostObject.r_score, pearsonValue, spearmanValue, kendalltauValue]
            matrixResponse.append(row)
            iteracionesCorrectas+=1
        except:
            iteracionesIncorrectas+=1
            pass

#Baggin
for bootstrap in [True, False]:
    for n_estimators in [10,50,100,200,500,1000,1500,2000]:
        try:
            print ("Excec Bagging with {} - {}".format(bootstrap, n_estimators))
            bagginObject = Baggin.Baggin(data,target,n_estimators, bootstrap)
            bagginObject.trainingMethod()

            performanceValues = performanceData.performancePrediction(target, bagginObject.predicctions.tolist())
            pearsonValue = performanceValues.calculatedPearson()['pearsonr']
            spearmanValue = performanceValues.calculatedSpearman()['spearmanr']
            kendalltauValue = performanceValues.calculatekendalltau()['kendalltau']

            params = "bootstrap:%s-n_estimators:%d" % (str(bootstrap), n_estimators)
            row = ["Bagging", params, bagginObject.r_score, pearsonValue, spearmanValue, kendalltauValue]
            matrixResponse.append(row)
            iteracionesCorrectas+=1
        except:
            iteracionesIncorrectas+=1
            pass

#DecisionTree
for criterion in ['mse', 'friedman_mse', 'mae']:
    for splitter in ['best', 'random']:
        try:
            print ("Excec DecisionTree with {} - {}".format(criterion, splitter))
            decisionTreeObject = DecisionTree.DecisionTree(data, target, criterion, splitter)
            decisionTreeObject.trainingMethod()

            performanceValues = performanceData.performancePrediction(target, decisionTreeObject.predicctions.tolist())
            pearsonValue = performanceValues.calculatedPearson()['pearsonr']
            spearmanValue = performanceValues.calculatedSpearman()['spearmanr']
            kendalltauValue = performanceValues.calculatekendalltau()['kendalltau']

            params = "criterion:%s-splitter:%s" % (criterion, splitter)
            row = ["DecisionTree", params, decisionTreeObject.r_score, pearsonValue, spearmanValue, kendalltauValue]
            matrixResponse.append(row)
            iteracionesCorrectas+=1
        except:
            iteracionesIncorrectas+=1
            pass

#gradiente
for loss in ['ls', 'lad', 'huber', 'quantile']:
    for criterion in ['friedman_mse', 'mse', 'mae']:
        for n_estimators in [10,50,100,200,500,1000,1500,2000]:
            try:
                print ("Excec GradientBoostingRegressor with {} - {} - {} - {}".format(loss, n_estimators, 2, 1))
                gradientObject = Gradient.Gradient(data,target,n_estimators, loss, criterion, 2, 1)
                gradientObject.trainingMethod()

                performanceValues = performanceData.performancePrediction(target, gradientObject.predicctions.tolist())
                pearsonValue = performanceValues.calculatedPearson()['pearsonr']
                spearmanValue = performanceValues.calculatedSpearman()['spearmanr']
                kendalltauValue = performanceValues.calculatekendalltau()['kendalltau']

                params = "criterion:%s-n_estimators:%d-loss:%s-min_samples_split:%d-min_samples_leaf:%d" % (criterion, n_estimators, loss, 2, 1)
                row = ["GradientBoostingClassifier", params, gradientObject.r_score, pearsonValue, spearmanValue, kendalltauValue]
                matrixResponse.append(row)
                iteracionesCorrectas+=1
            except:
                iteracionesIncorrectas+=1
                pass

#knn
for n_neighbors in range(1,11):
    for algorithm in ['auto', 'ball_tree', 'kd_tree', 'brute']:
        for metric in ['minkowski', 'euclidean']:
            for weights in ['uniform', 'distance']:
                try:
                    print ("Excec KNeighborsRegressor with {} - {} - {} - {}".format(n_neighbors, algorithm, metric, weights))
                    knnObect = knn_regression.KNN_Model(data, target, n_neighbors, algorithm, metric,  weights)
                    knnObect.trainingMethod()

                    performanceValues = performanceData.performancePrediction(target, knnObect.predicctions.tolist())
                    pearsonValue = performanceValues.calculatedPearson()['pearsonr']
                    spearmanValue = performanceValues.calculatedSpearman()['spearmanr']
                    kendalltauValue = performanceValues.calculatekendalltau()['kendalltau']

                    params = "n_neighbors:%d-algorithm:%s-metric:%s-weights:%s" % (n_neighbors, algorithm, metric, weights)
                    row = ["KNeighborsClassifier", params, knnObect.r_score, pearsonValue, spearmanValue, kendalltauValue]
                    matrixResponse.append(row)
                    iteracionesCorrectas+=1
                except:
                    iteracionesIncorrectas+=1
                    pass

#NuSVR
for kernel in ['rbf', 'linear', 'poly', 'sigmoid', 'precomputed']:
    for nu in [0.01, 0.05, 0.1, 0.5]:
        for degree in range(3, 15):
            try:
                print ("Excec NuSVM")
                nuSVM = NuSVR.NuSVRModel(data, target, kernel, degree, 0.01, nu)
                nuSVM.trainingMethod()

                performanceValues = performanceData.performancePrediction(target, nuSVM.predicctions.tolist())
                pearsonValue = performanceValues.calculatedPearson()['pearsonr']
                spearmanValue = performanceValues.calculatedSpearman()['spearmanr']
                kendalltauValue = performanceValues.calculatekendalltau()['kendalltau']

                params = "kernel:%s-nu:%f-degree:%d-gamma:%f" % (kernel, nu, degree, 0.01)
                row = ["NuSVM", params, nuSVM.r_score, pearsonValue, spearmanValue, kendalltauValue]
                matrixResponse.append(row)
                iteracionesCorrectas+=1
            except:
                iteracionesIncorrectas+=1
                pass

#SVC
for kernel in ['rbf', 'linear', 'poly', 'sigmoid', 'precomputed']:
    for degree in range(3, 15):
        try:
            print ("Excec SVM")
            svm = SVR.SVRModel(data, target, kernel, degree, 0.01)
            svm.trainingMethod()

            performanceValues = performanceData.performancePrediction(target, svm.predicctions.tolist())
            pearsonValue = performanceValues.calculatedPearson()['pearsonr']
            spearmanValue = performanceValues.calculatedSpearman()['spearmanr']
            kendalltauValue = performanceValues.calculatekendalltau()['kendalltau']

            params = "kernel:%s-degree:%d-gamma:%f" % (kernel, degree, 0.01)
            row = ["SVM", params, svm.r_score, pearsonValue, spearmanValue, kendalltauValue]
            matrixResponse.append(row)
            iteracionesCorrectas+=1
        except:
            iteracionesIncorrectas+=1
            pass


#RF
for n_estimators in [10,50,100,200,500,1000,1500,2000]:
    for criterion in ['mse', 'mae']:
        for bootstrap in [True, False]:
            try:
                print ("Excec RF")
                rf = RandomForest.RandomForest(data, target, n_estimators, criterion, 2, 1, bootstrap)
                rf.trainingMethod()

                performanceValues = performanceData.performancePrediction(target, rf.predicctions.tolist())
                pearsonValue = performanceValues.calculatedPearson()['pearsonr']
                spearmanValue = performanceValues.calculatedSpearman()['spearmanr']
                kendalltauValue = performanceValues.calculatekendalltau()['kendalltau']

                params = "n_estimators:%d-criterion:%s-min_samples_split:%d-min_samples_leaf:%d-bootstrap:%s" % (n_estimators, criterion, 2, 1, str(bootstrap))
                row = ["RandomForestRegressor", params, rf.r_score, pearsonValue, spearmanValue, kendalltauValue]
                matrixResponse.append(row)
                iteracionesCorrectas+=1
            except:
                iteracionesIncorrectas+=1
                pass

matrixResponseRemove = []
for element in matrixResponse:
    if "ERROR" not in element:
        matrixResponseRemove.append(element)

#generamos el export de la matriz convirtiendo a data frame
dataFrame = pd.DataFrame(matrixResponseRemove, columns=header)

#generamos el nombre del archivo
nameFileExport = "%s%s/%s/summaryProcessJob_%s.csv" % (pathResponse, user, job, job)
dataFrame.to_csv(nameFileExport, index=False)

#estimamos los estadisticos resumenes para cada columna en el header
#instanciamos el object
statisticObject = summaryStatistic.createStatisticSummary(nameFileExport)
matrixSummaryStatistic = []

#"Pearson", "Spearman", "Kendalltau"
matrixSummaryStatistic.append(estimatedStatisticPerformance(statisticObject, 'R_Score'))
matrixSummaryStatistic.append(estimatedStatisticPerformance(statisticObject, 'Pearson'))
matrixSummaryStatistic.append(estimatedStatisticPerformance(statisticObject, 'Spearman'))
matrixSummaryStatistic.append(estimatedStatisticPerformance(statisticObject, 'Kendalltau'))

#generamos el nombre del archivo
dataFrame = pd.DataFrame(matrixSummaryStatistic, columns=['Performance','Mean', 'STD', 'Variance', 'MAX', 'MIN'])
nameFileExport = "%s%s/%s/statisticPerformance_%s.csv" % (pathResponse, user, job, job)
dataFrame.to_csv(nameFileExport, index=False)

#cambiamos el estado al job
connectDB = ConnectDataBase.ConnectDataBase()
handler = HandlerQuery.HandlerQuery()

#hacemos la consulta
query = "update job set job.statusJob = 'FINISH', job.modifiedJob= NOW() where job.idjob=%s" % job

connectDB.initConnectionDB()
handler.insertToTable(query, connectDB)
connectDB.closeConnectionDB()

finishTime = time.time() - start_time
termino = datetime.datetime.now()

dictionary = {}
dictionary.update({"inicio": str(inicio)})
dictionary.update({"termino": str(termino)})
dictionary.update({"ejecucion": finishTime})
dictionary.update({"user": user})
dictionary.update({"job": job})
dictionary.update({"iteracionesCorrectas": iteracionesCorrectas})
dictionary.update({"iteracionesIncorrectas": iteracionesIncorrectas})

nameFileExport = "%s%s/%s/summaryProcess_%s.json" % (pathResponse, user, job, job)
with open(nameFileExport, 'w') as fp:
    json.dump(dictionary, fp)

#enviar correo con finalizacion del job....
body = "Dear %s.\nThe job with ID: %s has been update to status: FINISH. It will notify by email when job finish.\nBest Regards, SmartTraining Team" % (nameUser, job)
emailData = sendEmail.sendEmail('smarttrainingserviceteam@gmail.com', emailUser, "Change status in job "+ str(job), body, 'smart123ewq')
emailData.sendEmailUser()
