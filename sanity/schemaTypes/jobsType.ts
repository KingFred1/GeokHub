import { defineType, defineField } from "sanity";

export const jobTypes = defineType({
  name: "job",
  title: "Job Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "jobType",
      title: "Job Type",
      type: "string",
      options: {
        list: [
          { title: "Remote", value: "remote" },
          { title: "Full-Time", value: "full-time" },
          { title: "Part-Time", value: "part-time" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company Name",
      type: "string",
    }),
    defineField({
      name: "companyLogo",
      title: "Company Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Leave blank if remote only",
    }),
    defineField({
      name: "salary",
      title: "Salary / Compensation",
      type: "string",
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "description",
      title: "Job Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" }
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" }
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" }
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url"
                  }
                ]
              }
            ]
          }
        }
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "deadline",
      title: "Application Deadline",
      type: "date",
    }),
    defineField({
      name: "applyLink",
      title: "Apply Link",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "company",
      media: "companyLogo",
    },
  },
});
