import { defineField, defineType } from "sanity";

export const ssocialLinksType = defineType({
  name: "socialLinks",
  title: "Social Links",
  type: "document",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Twitter", value: "twitter" },
          { title: "GitHub", value: "github" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Instagram", value: "instagram" },
          { title: "Facebook", value: "facebook" },
        ],
      },
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
});
