import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import { subCategoryType } from './subCategoryType'
import { aboutType } from './aboutType'
import { contactType } from './contactType'
import { ssocialLinksType } from './socialLinksType'
import { jobTypes } from './jobsType'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType,  categoryType, subCategoryType, postType, jobTypes, authorType, aboutType, contactType, ssocialLinksType],

}
