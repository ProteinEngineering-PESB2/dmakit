from modulesProject.models_export import useModels
import pandas as pd
import sys

dataSet = pd.read_csv(sys.argv[1])
model = sys.argv[2]
pathResponse = sys.argv[3]

tryModel = useModels.useModels(dataSet, model, pathResponse)
tryModel.scaleDataSet()
tryModel.applyModel()
