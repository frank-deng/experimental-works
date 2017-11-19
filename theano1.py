#!/usr/bin/env python3

import theano
import theano.tensor as T
import numpy as np

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
    x_data = np.linspace(-1, 1, 300)[:, np.newaxis];
    noise = np.random.normal(0, 0.05, x_data.shape);
    y_data = np.square(x_data) - 0.5 + noise;

    x, y = T.dmatrix('x'), T.dmatrix('y');
    layer0 = Layer(x, 1, 10, T.nnet.relu);
    layer1 = Layer(layer0.outputs, 10, 1, None);

    cost = T.mean(T.square(layer1.outputs - y));
    gW0, gb0, gW1, gb1 = T.grad(cost, [layer0.W, layer0.b, layer1.W, layer1.b]);

    learning_rate = 0.05;
    train = theano.function(inputs = [x, y], outputs = cost, updates = [
        (layer0.W, layer0.W - learning_rate*gW0),
        (layer0.b, layer0.b - learning_rate*gb0),
        (layer1.W, layer1.W - learning_rate*gW1),
        (layer1.b, layer1.b - learning_rate*gb1),
    ]);
    predict = theano.function(inputs=[x], outputs=layer1.outputs);

    fig = plt.figure();
    ax = fig.add_subplot(1,1,1);
    ax.scatter(x_data, y_data);
    plt.ion();
    plt.show();
    lines = None;
    for i in range(1000):
        err = train(x_data, y_data);
        if i%50 == 0:
            if lines is not None:
                ax.lines.remove(lines[0]);
            lines = ax.plot(x_data, predict(x_data), 'r-', lw = 5)
            plt.pause(1);
    plt.waitforbuttonpress();

