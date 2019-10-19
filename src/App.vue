<template>
  <div>
    <div class="header">
      <form v-on:submit.prevent="updateDirTree">
        <input class="path" type="text" v-model="path" required />
        <input type="submit" value="->" />
        <label>{{status}}</label>
      </form>
      <div class="buttonbar" v-show="isButtonBarShown">
        <span>[Save]</span>
        <span>[Exe]</span>
      </div>
    </div>
    <div class="body">
      <div class="split" id="left">
        <span class="closer" tabindex="0" @click="closeAllDetails" @keyup="closeAllDetails">[-]</span>
        <DirTree @updatePath="updatePath" class="tree" :nodes="nodes" :editor="editor" />
      </div>
      <div class="split" id="right">
        <div id="editor"></div>
      </div>
    </div>
  </div>
</template>

<script>
//@ts-check

import DirTree from "./components/DirTree.vue";
import { getDirTree, DirTree as Tree } from "./modules/http";
import Split from "split.js";
import * as monaco from "monaco-editor";

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
      editor: {},
      isButtonBarShown: true
    };
  },
  computed: {
    ext() {
      return ["js", "txt", "iim"];
    },
    gutterMovedEventType() {
      return "gutterMoved";
    },
    minWidthButtonBarShown() {
      return 700;
    }
  },
  mounted() {
    this.initButtonBarHidden();

    this.initSplitter();

    this.initEditor();

    this.updateDirTree();
  },
  methods: {
    initButtonBarHidden() {
      window.addEventListener("resize", () => {
        const header = this.$el.querySelector(".header");
        this.isButtonBarShown =
          header.clientWidth >= this.minWidthButtonBarShown;
      });
    },

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
      this.editor = monaco.editor.create(document.getElementById("editor"), {
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
:root {
  --body-height: 90vh;
}

.header {
  display: flex;
}

form {
  flex: 1;
  white-space: nowrap;
}

.path {
  width: 80%;
}

div.buttonbar {
  display: flex;
  width: fit-content;
}

.buttonbar span {
  flex: 0 1 auto;
  margin-left: 10vh;
  margin-right: 10vh;
  margin-top: auto;
  margin-bottom: auto;
}

.body {
  margin-top: 2vh;
}

div#left {
  overflow-x: scroll;
  overflow-y: scroll;
  height: var(--body-height);
}

span.closer {
  cursor: pointer;
  background-color: lightgray;
}

#editor {
  width: 100%;
  height: var(--body-height);
  border: 1px solid #ccc;
}

.split,
.gutter.gutter-horizontal {
  float: left;
  height: var(--body-height);
}

.gutter.gutter-horizontal {
  cursor: col-resize;
  background-color: gray;
  width: 5px;
}
</style>
