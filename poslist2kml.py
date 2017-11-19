#!/usr/bin/env python3
import sys;
if __name__ == '__main__':
    line = 'STDIN';
    data_pos = [];
    while line:
        line = sys.stdin.readline();
        line_data = line.split();
        if (len(line_data) == 2):
            data_pos.append({'lat':float(line_data[0]), 'lon':float(line_data[1])});

    route_name='';
    sys.stdout.write("""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://earth.google.com/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
	<Document>
		<name>""" + route_name + """</name>
		<Style id="track">
			<BalloonStyle>
				<displayMode>default</displayMode>
			</BalloonStyle>
			<IconStyle>
				<scale>1.000000</scale>
				<Icon>
					<href>/usr/share/kde4/apps/marble/data/bitmaps/default_location.png</href>
				</Icon>
				<hotSpot x="0.500000" y="0.500000" xunits="fraction" yunits="fraction"/>
			</IconStyle>
			<LineStyle>
				<color>c80008e2</color>
				<width>4</width>
			</LineStyle>
			<ListStyle/>
			<PolyStyle>
				<fill>1</fill>
				<outline>1</outline>
			</PolyStyle>
		</Style>
		<StyleMap id="map-track">
			<Pair>
				<key>normal</key>
				<styleUrl>#track</styleUrl>
			</Pair>
		</StyleMap>
		<Placemark>
			<name>""" + route_name + """</name>
			<styleUrl>#map-track</styleUrl>
			<gx:MultiTrack>
				<gx:Track>
""");

    for p in data_pos:
        sys.stdout.write('                     <gx:coord>' + str(p['lon']) + ' ' + str(p['lat']) + '</gx:coord>\n');

    sys.stdout.write("""                </gx:Track>
			</gx:MultiTrack>
		</Placemark>
	</Document>
</kml>
""");

