import {defineConfig} from '@playwright/test';
import base from './playwright.config';
export default defineConfig({...base,timeout:60_000,testMatch:'**/editor/*.spec.ts',testIgnore:[],workers:1,projects:[{name:'editor',use:{viewport:{width:1440,height:1000}}}]});
