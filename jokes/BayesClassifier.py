from math import log;
import copy;

class BayesClassifier:
    __data = {};
    __total = {};
    __p = {};
    __pTypes = {};
    def __init__(self, types):
        for t in types:
            self.__data[t] = {};
            self.__total[t] = 0;
            self.__p[t] = {};
            self.__pTypes[t] = None;

    def reset(self):
        for t in self.__data.keys():
            self.__data[t].reset();
            self.__total[t] = 0;
            self.__p[t].reset();
            self.__pTypes[t] = None;

    def train(self, data):
        for _type in data:
            __trainData = data[_type];
            __data = self.__data[_type];
            if (type(__trainData) is list) or (type(__trainData) is tuple):
                for item in __trainData:
                    __data[item] = __data.get(item, 0) + 1;
                    self.__total[_type] += 1;
            elif type(__trainData) is dict:
                for item in __trainData:
                    count = __trainData[item];
                    __data[item] = __data.get(item, 0) + count;
                    self.__total[_type] += count;

        allTypesTotal = sum(self.__total.values());
        for _type in self.__data:
            dataThisType = self.__data[_type];
            total = self.__total[_type];
            for item in dataThisType:
                self.__p[_type][item] = log((dataThisType[item] + 1) / (total + 2));
            self.__pTypes[_type] = log(total / allTypesTotal);

    def getTrainedData(self):
        return copy.deepCopy(self.__data);

    def classify(self, data):
        result = {};
        for t in self.__data:
            result[t] = self.__pTypes[t];
            for item in data:
                result[t] += self.__p[t].get(item, log(1/ self.__total[t] + 2));
        return min(result, key = lambda k: result[k]);

