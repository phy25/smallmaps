import { existsSync } from "fs";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import { mapsCollection } from "./src/maps/maps.collection.js";

export default function (eleventyConfig) {
  // CSS: bundle plugin extracts from <style> tags automatically
  eleventyConfig.addPlugin(pluginBundle, {
    bundleHtmlContentFromSelector: "style",
  });

  // Maps collection (logic co-located in maps/maps.collection.js)
  eleventyConfig.addCollection("maps", mapsCollection);

  // Filter: reshape map objects to the ANNOTATIONS shape the viewer expects
  eleventyConfig.addFilter("toAnnotations", (maps) =>
    maps.filter((m) => m.annotation_json_url).map((m) => ({
      label: m.label?.zh ?? m.label?.en ?? m.label,
      description: m.description,
      url: m.annotation_json_url,
      more_link: m.more_link,
      edit_link: m.edit_link,
    }))
  );

  // HTTPS dev server (reuses existing certs if present)
  eleventyConfig.setServerOptions({
    port: 8000,
    https: existsSync("./key.pem") && existsSync("./cert.pem")
      ? { key: "./key.pem", cert: "./cert.pem" }
      : undefined,
    middleware: [
      (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
      },
    ],
  });

  return { dir: { input: "src", output: "_site" } };
}
