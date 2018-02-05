

// https://cdn.earthdata.nasa.gov/conduit/upload/6852/geotiff-1.8.1-1995-10-31.pdf
// https://www.itu.int/itudoc/itu-t/com16/tiff-fx/docs/tiff6.pdf


import fs from "fs";
import * as GeoTIFF from "./src/GeoTIFF.mjs";

console.log("=======================================================================================================");
console.log("=======================================================================================================");
console.log("=======================================================================================================");

Uint32Array.prototype.inspect = function(){
	return `${this.constructor.name} [${Array.from(this).join(", ")}]`;
};

Uint16Array.prototype.inspect = function(){
	return `${this.constructor.name} [${Array.from(this).join(", ")}]`;
};

Uint8Array.prototype.inspect = function(){
	return `${this.constructor.name} [${Array.from(this).join(", ")}]`;
};

{ // TEST READER
	try{
		let data = fs.readFileSync("./resources/cea.tif");
		//let data = fs.readFileSync("./resources/test.tif");
		let image = GeoTIFF.Reader.read(data);
		console.log(image.metadata);
	}catch(e){
		console.log(e);
	}
}

{ // TEST WRITER
	let image = new GeoTIFF.Image();
	image.width = 800;
	image.height = 600;
	image.buffer = new Uint8Array(image.width * image.height * 4);

	for(let y = 0; y < image.height; y++){
		for(let x = 0; x < image.width; x++){
			let u = x / image.width;
			let v = y / image.width;

			let r = parseInt(u * 255);
			let g = parseInt(v * 255);
			let b = 0;
			image.buffer[4 * x + 4 * image.width * y + 0] = r;
			image.buffer[4 * x + 4 * image.width * y + 1] = g;
			image.buffer[4 * x + 4 * image.width * y + 2] = b;
			image.buffer[4 * x + 4 * image.width * y + 3] = 255;
		}
	}


	{
		let ifdEntries = [
			new GeoTIFF.IFDEntry(
				GeoTIFF.Tag.MODEL_PIXEL_SCALE, 
				GeoTIFF.Type.DOUBLE, 3, null, 
				new Float64Array([60.02213698319374, 60.02213698319374, 0])),
			new GeoTIFF.IFDEntry(
				GeoTIFF.Tag.MODEL_TIEPOINT, 
				GeoTIFF.Type.DOUBLE, 6, null, 
				new Float64Array([ 0, 0, 0, -28493.166784412522, 4255884.5438021915, 0 ])),
			new GeoTIFF.IFDEntry(
				GeoTIFF.Tag.GEO_KEY_DIRECTORY, 
				GeoTIFF.Type.SHORT, 60, null, 
				new Uint16Array([1, 1, 0, 14, 1024, 0, 1, 1, 1025, 0, 1, 1, 1026, 34737, 8, 0, 2048, 0, 1, 4267, 2049, 34737, 6, 8, 2054, 0, 1, 9102, 3072, 0, 1, 32767, 3074, 0, 1, 32767, 3075, 0, 1, 28, 3076, 0, 1, 9001, 3078, 34736, 1, 1, 3080, 34736, 1, 0, 3082, 34736, 1, 2, 3083, 34736, 1, 3])),
			new GeoTIFF.IFDEntry(
				GeoTIFF.Tag.GEO_DOUBLE_PARAMS, 
				GeoTIFF.Type.DOUBLE, 4, null, 
				new Uint16Array([ -117.333333333333, 33.75, 0, 0 ])),
			new GeoTIFF.IFDEntry(
				GeoTIFF.Tag.GEO_ASCII_PARAMS, 
				GeoTIFF.Type.ASCII, 15, null, 
				'unnamed|NAD27|\u0000'),
		];

		let {width, height, buffer} = GeoTIFF.Exporter.toTiffBuffer(image, {ifdEntries: ifdEntries});

		fs.writeFile("./result.tif", buffer, (err) => {
			if(err){
				console.log("error trying to save file");
			}else{
				console.log("file saved");
			}
		});
	}
}