#!/usr/bin/env python3

import theano
import theano.tensor as T
import numpy as np

def compute_accuracy(y_target, y_predict):
    prediction = np.equal(y_predict, y_target);
    return np.sum(prediction) / len(prediction);

'''
Usage:

layer1 = Layer(inputs, in_size=1, out_size=10, activation_func=T.nnet.relu);
layer2 = Layer(l1.outputs, 10, 1, None);
'''
class Layer:
    def __init__(self, inputs, in_size, out_size, activation_func = None):
        self.W = theano.shared(np.random.normal(0,1, (in_size, out_size)));
        self.b = theano.shared(np.zeros((out_size,)) + 0.1);
        self.Wx_plus_b = T.dot(inputs, self.W) + self.b;
        self.activation_func = activation_func;
        if activation_func is None:
            self.outputs = self.Wx_plus_b;
        else:
            self.outputs = self.activation_func(self.Wx_plus_b);

if __name__ == '__main__':
    import matplotlib.pyplot as plt;
    N = 400;
    features = 784;
    data = (np.random.randn(N, features), np.random.randint(size=N, low=0, high=2));
    x = T.dmatrix('x');
    y = T.dvector('y');

    W = theano.shared(np.random.randn(features), name='w');
    b = theano.shared(0.1, name='b');

    p1 = T.nnet.sigmoid(T.dot(x, W) + b);
    prediction = (p1 > 0.5);
    xent = -y*T.log(p1) - (1-y)*T.log(1-p1)
    cost = xent.mean() + 0.01 * (W ** 2).sum();
    gW, gb = T.grad(cost, [W, b]);

    learning_rate = 0.1;
    train = theano.function(
        inputs=[x, y],
        outputs=[prediction, xent.mean()],
        updates=((W, W - learning_rate * gW), (b, b - learning_rate * gb))
    );
    predict = theano.function(inputs=[x], outputs=prediction);
    for i in range(500):
        pred, err = train(data[0], data[1]);
        if i % 50 == 0:
            print('Cost:',err,'\tAccuracy:',compute_accuracy(data[1], predict(data[0])));
    print('Target:',data[1]);
    print('Predict:', predict(data[0]));


