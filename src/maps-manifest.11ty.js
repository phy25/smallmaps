class IiifManifest {
  data() {
    return {
      pagination: { data: "collections.maps", size: 1, alias: "map" },
      permalink: (data) => `/maps/${data.map.imageId}/manifest.json`,
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const { imageId, label, imageDimensions } = data.map;
    const base = data.site.baseUrl;
    const { width: w, height: h } = imageDimensions;
    const svcId = `${base}/maps/${imageId}/image`;
    const paintingUrl = `${svcId}/full/${w},${h}/0/default.jpg`;

    return JSON.stringify(
      {
        "@context": "http://iiif.io/api/presentation/3/context.json",
        id: `${base}/maps/${imageId}/manifest.json`,
        type: "Manifest",
        label,
        items: [
          {
            id: `${base}/maps/${imageId}/canvas/1`,
            type: "Canvas",
            width: w,
            height: h,
            items: [
              {
                id: `${base}/maps/${imageId}/page/1`,
                type: "AnnotationPage",
                items: [
                  {
                    id: `${base}/maps/${imageId}/annotation/1`,
                    type: "Annotation",
                    motivation: "painting",
                    body: {
                      id: paintingUrl,
                      type: "Image",
                      format: "image/jpeg",
                      width: w,
                      height: h,
                      service: [
                        { id: svcId, type: "ImageService3", profile: "level2" },
                      ],
                    },
                    target: `${base}/maps/${imageId}/canvas/1`,
                  },
                ],
              },
            ],
          },
        ],
      },
      null,
      2
    );
  }
}

export default new IiifManifest();
