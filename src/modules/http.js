//@ts-check
"use strict";

import Path from "path";

const DIRTREE_URL = "http://127.0.0.1:5000/dirtree";
const FILE_URL = "http://127.0.0.1:5000/file";

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
  const relative = path.fullPath.replace(path.top + "\\", "");

  console.log(path.fullPath, path.top, relative);

  const resp = await fetch(`${FILE_URL}/${relative}`, { mode: "cors" });
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
