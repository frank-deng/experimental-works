#!/usr/bin/env python3

import sys;
from xml.etree import ElementTree as XmlTree;
xmlDoc = XmlTree.parse(sys.argv[1]);
xmlRoot = xmlDoc.getroot();

noteTable={
    'C':1,
    'D':3,
    'E':5,
    'F':6,
    'G':8,
    'A':10,
    'B':12,
}
res=''
octave_last=None
for noteXml in xmlRoot.findall('.//note'):
    step=noteXml.find('.//step').text;
    octave=int(noteXml.find('.//octave').text);
    length=noteXml.find('.//type').text;
    accidental=None;
    accidentalXml=noteXml.find('.//accidental');
    if None!=accidentalXml:
        accidental=accidentalXml.text;
        if 'natural'==accidental:
            accidental=None;
    if octave_last is None:
        res+=f' O{octave-2}'
        octave_last=octave
    elif octave_last!=octave:
        octave_diff=octave-octave_last
        if octave_diff==-1:
            res+='<'
        elif octave_diff==1:
            res+='>'
        else:
            res+=f' O{octave-2}'
        octave_last=octave

    note=step
    noteNum=noteTable[step];
    if 'sharp'==accidental:
        note+='#'
    elif 'flat'==accidental:
        note+='-'
    res+=note
    if 'quarter'==length:
        res+=note

print(res)
