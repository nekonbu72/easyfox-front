<template>
  <div>
    <form v-on:submit.prevent="updateDirTree">
      <label>file:/</label>
      <input class="path" type="text" v-model="path" required />
      <input type="submit" value="->" />
      <label>{{status}}</label>
    </form>

    <p></p>
    <div class="wrapper">
      <div class="split" id="left">
        <span class="closer" tabindex="0" @click="closeAllDetails" @keyup="closeAllDetails">[-]</span>
        <DirTree @updatePath="updatePath" class="tree" :nodes="nodes" :editor="editor" />
      </div>
      <div class="split" id="right">
        <div id="container"></div>
      </div>
    </div>
  </div>
</template>

<script>
//@ts-check

import DirTree from "./components/DirTree.vue";
// import { walkDir, DirNode } from "./modules/walkDir";
import { getDirTree, DirTree as Tree } from "./modules/http";
import Split from "split.js";
import * as monaco from "monaco-editor";
import Path from "path";

export default {
  name: "app",
  components: {
    DirTree
  },
  data() {
    return {
      path: "C:\\easyfox_test",
      status: "Waiting...",
      nodes: [],
      /**
       * @type {monaco.editor.IStandaloneCodeEditor}
       */
      editor: {}
    };
  },
  computed: {
    ext() {
      return ["js", "txt", "iim"];
    },
    url() {
      return Path.join("file:", this.path);
    },
    gutterMovedEventType() {
      return "gutterMoved";
    }
  },
  mounted() {
    this.initSplitter();

    this.initEditor();

    this.updateDirTree();
  },
  methods: {
    initSplitter() {
      const left = this.$el.querySelector("div#left"),
        right = this.$el.querySelector("div#right");

      const split = Split([left, right], {
        sizes: [25, 75],
        minSize: [100, 300],
        gutterSize: 3,
        onDragEnd: () => {
          leftWidth = left.clientWidth;
          this.$el.dispatchEvent(new Event(this.gutterMovedEventType));
        }
      });

      let leftWidth = left.clientWidth;
      window.addEventListener("resize", () => {
        const leftRatio = Math.round(
          (leftWidth / (left.clientWidth + right.clientWidth)) * 100
        );
        split.setSizes([leftRatio, 100 - leftRatio]);
        leftWidth = left.clientWidth;
      });
    },
    initEditor() {
      this.editor = monaco.editor.create(document.getElementById("container"), {
        language: "javascript",
        minimap: { enabled: false }
      });
      window.addEventListener("resize", () => {
        this.editor.layout();
      });
      this.$el.addEventListener(this.gutterMovedEventType, () => {
        this.editor.layout();
      });
    },
    async updateDirTree() {
      const timer1 = new Date();
      this.status = "Loading...";

      const tree = await getDirTree();
      this.nodes = tree.children;

      const timer2 = new Date();
      this.status = `Done(${(timer2.getTime() - timer1.getTime()) / 1000}s).`;
    },
    closeAllDetails() {
      const tree = this.$el.querySelector(".tree");
      tree
        .querySelectorAll("details")
        .forEach(details => (details.open = false));
    },
    /**
     * @param{string}newPath
     */
    updatePath(newPath) {
      this.path = newPath;
    }
  }
};
</script>

<style>
.path {
  width: 60%;
}

div#left {
  overflow-x: scroll;
  overflow-y: scroll;
  height: 90vh;
}

span.closer {
  cursor: pointer;
  background-color: lightgray;
}

#container {
  width: 100%;
  height: 90vh;
  border: 1px solid #ccc;
}

.split,
.gutter.gutter-horizontal {
  float: left;
  height: 100vh;
}

.gutter.gutter-horizontal {
  cursor: col-resize;
  background-color: gray;
  width: 5px;
}
</style>
