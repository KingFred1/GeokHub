import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const subCategoryType = defineType({
  name: "subcategory",
  title: "SubCategory",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "parentCategory",
      type: "reference",
      to: [{ type: "category" }],
    }),
  ],
});
