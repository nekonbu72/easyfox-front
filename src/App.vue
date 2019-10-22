<template>
  <div>
    <div class="header">
      <div class="flex">
        <input type="text" class="path" v-model="path" required />
      </div>
      <div class="solid" v-show="isbtnbarShown">
        <input type="submit" class="btn update" @click="updateDirTree" value="->" />
        <input type="submit" class="btn save" value="Save" />
        <input type="submit" class="btn exe" value="Exe" />
        <label class="status">{{status}}</label>
      </div>
    </div>
    <div class="body">
      <div class="split" id="left">
        <input type="submit" class="btn close" value="-" @click="closeAllDetails" />
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
      isbtnbarShown: true
    };
  },
  computed: {
    ext() {
      return ["js", "txt", "iim"];
    },
    gutterMovedEventType() {
      return "gutterMoved";
    },
    minWidthbtnbarShown() {
      return 700;
    }
  },
  mounted() {
    this.initBtnBarHidden();

    this.initSplitter();

    this.initEditor();

    this.updateDirTree();
  },
  methods: {
    initBtnBarHidden() {
      window.addEventListener("resize", () => {
        const header = this.$el.querySelector(".header");
        this.isbtnbarShown = header.clientWidth >= this.minWidthbtnbarShown;
      });
    },

    initSplitter() {
      const left = this.$el.querySelector("div#left"),
        right = this.$el.querySelector("div#right");

      const split = Split([left, right], {
        // sizes: [25, 75],
        minSize: [100, 300],
        gutterSize: 3,
        onDragEnd: () => {
          leftWidth = left.clientWidth;
          this.$el.dispatchEvent(new Event(this.gutterMovedEventType));
        }
      });

      let leftWidth = left.clientWidth;
      window.addEventListener("resize", () => {
        const leftRatio = Math.ceil(
          (leftWidth / (left.clientWidth + right.clientWidth)) * 100
        );

        // split.setSizes([leftRatio, 100 - leftRatio]);
        leftWidth = left.clientWidth;

        console.log(`${leftRatio}%, ${left.clientWidth}, ${right.clientWidth}`);
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
  --header-height: 8vh;
}

.header {
  display: flex;
  height: var(--header-height);
}

div.flex {
  flex: 1;
  white-space: nowrap;
}

div.flex .path {
  width: 100%;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
}

div.solid {
  display: flex;
  width: fit-content;
}

div.solid * {
  flex: 0 1 auto;
  margin: 0 1vh;
  padding: 0 2vh;
}

.body {
  margin-top: 2vh;
}

div#left {
  overflow-x: scroll;
  overflow-y: scroll;
  height: var(--body-height);
}

.btn.close {
  height: var(--header-height);
  width: var(--header-height);
}

#editor {
  width: 100%;
  height: var(--body-height);
  border: 1px solid #ccc;
}

.body {
  display: flex;
}

.body .rigth {
  flex: 1;
}

.split,
.gutter.gutter-horizontal {
  height: var(--body-height);
}

.gutter.gutter-horizontal {
  cursor: col-resize;
  background-color: gray;
  width: 5px;
}
</style>
