import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { SendMailOptions } from 'nodemailer';

import { Template } from './types';

export const getHtmlString = (templateName: Template): string => {
  const filePath = path.join(__dirname, './templates', templateName);
  return fs.readFileSync(filePath, 'utf-8').toString();
};

export const compileTemplate = (
  templateName: Template,
  replacements: Record<string, unknown>,
): string => {
  const htmlString = getHtmlString(templateName);
  const buildTemplate = handlebars.compile(htmlString);

  return buildTemplate(replacements);
};

export const buildSendMailOptions = (
  to: string,
  subject: string,
  html: Template,
  htmlData: Record<string, unknown>,
): SendMailOptions => ({
  to: to,
  from: process.env.EMAIL_USERNAME,
  subject: subject,
  html: compileTemplate(html, htmlData),
});
