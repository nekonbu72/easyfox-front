//@ts-check
"use strict";

const DIRTREE_URL = "http://127.0.0.1:5000/dirtree";
const FILE_URL = "http://127.0.0.1:5000/file";
const EXE_URL = "http://127.0.0.1:5000/exe";

/**
 * @returns {Promise<DirTree>}
 */
export const getDirTree = async () => {
  const resp = await fetch(DIRTREE_URL, { mode: "cors" });
  return await resp.json();
};

/**
 *
 * @param {DirTree} path
 * @return {Promise<string>}
 */
export const getFile = async path => {
  const resp = await fetch(`${FILE_URL}/${path.relative}`, {
    mode: "cors"
  });
  return await resp.text();
};

/**
 *
 * @param {DirTree} path
 * @param {string} text
 * @return {Promise<string>}
 */
export const postFile = async (path, text) => {
  const resp = await fetch(`${FILE_URL}/${path.relative}`, {
    method: "POST",
    mode: "cors",
    body: text,
    headers: {
      "Content-Type": "text/plain"
    }
  });
  return await resp.text();
};

/**
 *
 * @param {string} script
 * @return {Promise<string>}
 */
export const postExe = async script => {
  const resp = await fetch(EXE_URL, {
    method: "POST",
    mode: "cors",
    body: script,
    headers: {
      "Content-Type": "text/plain"
    }
  });
  return await resp.text();
};

export class DirTree {
  constructor() {
    /**
     * @type {boolean}
     */
    this.exists = false;

    /**
     * @type {string}
     */
    this.parent = "";

    /**
     * @type {string}
     */
    this.name = "";

    /**
     * @type {string}
     */
    this.stem = "";

    /**
     * @type {string}
     */
    this.suffix = "";

    /**
     * @type {string}
     */
    this.fullPath = "";

    /**
     * @type {boolean}
     */
    this.isDir = false;

    /**
     * @type {boolean}
     */
    this.isFile = false;

    /**
     * @type {number}
     */
    this.depth = 0;

    /**
     * @type {string}
     */
    this.top = "";

    /**
     * @type {string}
     */
    this.relative = "";

    /**
     * @type {boolean}
     */
    this.hasChildren = false;

    /**
     * @type {number}
     */
    this.countChildren = 0;

    /**
     * @type {DirTree[]}
     */
    this.children = [];

    /**
     * @type {boolean}
     */
    this.isAllowedSuffix = false;
  }
}
