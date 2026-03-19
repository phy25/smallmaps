import Image from "@11ty/eleventy-img";
import path from "path";

export async function mapsCollection(api) {
  const items = api.getFilteredByGlob("src/maps/*/index.md");
  return Promise.all(
    items.map(async (item) => {
      const imageId = item.inputPath.split("/").at(-2);
      const imgPath = path.join("src", "maps", imageId, item.data.image_file);
      const stats = await Image(imgPath, {
        statsOnly: true,
        widths: [null],
        formats: ["jpeg"],
      });
      return {
        ...item.data,
        imageId,
        imageDimensions: {
          width: stats.jpeg[0].width,
          height: stats.jpeg[0].height,
        },
      };
    })
  );
}
