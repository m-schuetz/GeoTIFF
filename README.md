
# About

This is not a full featured GeoTIFF reader or writer.
It's written for a very limited use case, namely exporting georeferenced RGBA images with 8 bit per channel.

TIFF Spec: https://www.awaresystems.be/imaging/tiff/specification/TIFF6.pdf

GeoTIFF Spec: https://cdn.earthdata.nasa.gov/conduit/upload/6852/geotiff-1.8.1-1995-10-31.pdf


# Build & Test

Build for use in browsers:

```
rollup rollup.config.js
```

Run a node.js example:

```
node --experimental-modules ./test.js
```


