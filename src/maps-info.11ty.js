import Image from "@11ty/eleventy-img";
import path from "path";

class IiifInfo {
  data() {
    return {
      pagination: { data: "collections.maps", size: 1, alias: "map" },
      permalink: (data) => `/maps/${data.map.imageId}/image/info.json`,
      eleventyExcludeFromCollections: true,
    };
  }

  async render(data) {
    const { imageId, image_file, imageDimensions } = data.map;
    const { width: w, height: h } = imageDimensions;
    const halfW = Math.floor(w / 2);
    const halfH = Math.floor(h / 2);
    const imgPath = path.join("src", "maps", imageId, image_file);

    const imageOutputDir = data.page.outputPath.replace(/\/info\.json$/, "");

    const region = `0,0,${w},${h}`;
    for (const [tw, th] of [
      [w, h],
      [halfW, halfH],
    ]) {
      const tileSize = `${tw},${th}`;
      for (const regionDir of ["full", region]) {
        await Image(imgPath, {
          widths: [tw],
          formats: ["jpeg"],
          outputDir: path.join(imageOutputDir, regionDir, tileSize, "0"),
          filenameFormat: () => "default.jpg",
          sharpJpegOptions: { quality: 85 },
        });
      }
    }

    return JSON.stringify(
      {
        "@context": "http://iiif.io/api/image/3/context.json",
        id: `${data.site.baseUrl}/maps/${imageId}/image`,
        type: "ImageService3",
        protocol: "http://iiif.io/api/image",
        profile: "level2",
        width: w,
        height: h,
        tiles: [{ width: Math.max(w, h), scaleFactors: [1, 2] }],
        sizes: [2, 1].map((s) => ({
          width: Math.max(1, Math.floor(w / s)),
          height: Math.max(1, Math.floor(h / s)),
        })),
      },
      null,
      2
    );
  }
}

export default new IiifInfo();
