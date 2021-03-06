<template>
  <div>
    <div class="flex flex-row flex-wrap items-center justify-between">
      <username :user="post.user">
        <span>{{ date }}</span>
        <span v-if="post.category && showCategory" class="font-bold">
          {{ post.category.name }}
        </span>
        <span v-if="!post.verified" class="text-clr-input-danger">
          Unverified
        </span>
      </username>

      <div v-if="showOptions" class="flex flex-row align-middle mt-2 space-x-2">
        <router-link
          class="button"
          v-if="byCurrentUser"
          :to="{
            name: 'EditPost',
            params: {
              id: post.id
            }
          }"
        >
          <font-awesome-icon icon="pencil-alt" />
          <!-- Edit -->
        </router-link>

        <button
          v-if="byCurrentUser || isModOrAbove"
          @click="deletePost"
          class="button button-danger"
        >
          <font-awesome-icon icon="trash" />
          <!-- Delete -->
        </button>

        <template v-if="isModOrAbove">
          <button
            v-if="!post.verified"
            @click="verifyPost"
            class="button button-success"
          >
            Verify
          </button>
          <button
            v-if="post.verified"
            @click="unverifyPost"
            class="button button-danger"
          >
            Unverify
          </button>
        </template>

        <button
          @click="toggleLike"
          :class="{ active: post.isLiked }"
          class="button"
        >
          <font-awesome-icon icon="thumbs-up" />
          <template v-if="post.numberOfLikes">
            {{ post.numberOfLikes }}
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Username from "@/components/user/Username.vue";
import { postService } from "@/services";
import { defineComponent, computed } from "@vue/composition-api";
import { Post, User } from "@/types";
import { userStore } from "@/store";
import timeDifference from "@/util/timeDifference";

export default defineComponent({
  name: "PostMeta",
  props: {
    post: {
      type: Object as () => Post,
      required: true
    },
    showOptions: {
      type: Boolean as () => boolean
    },
    showCategory: {
      type: Boolean as () => boolean
    },
    dateType: {
      type: String as () => string
    }
  },
  components: {
    Username
  },

  setup(props, { root, emit }) {
    const currentUser = computed<User>(userStore.getters.user);
    const isModOrAbove = computed<boolean>(userStore.getters.isModOrAbove);
    const byCurrentUser = computed<boolean>(
      () => props.post.userId === currentUser.value.id
    );
    const date = computed<string>(() => {
      if (props.dateType === "relative")
        return timeDifference(new Date(), new Date(props.post.createdAt));
      else return new Date(props.post.createdAt).toDateString();
    });

    const deletePost = async () => {
      if (!confirm("Are you sure you want to permanently delete this post?"))
        return;

      try {
        await postService.delete(props.post.id);
        root.$toasted.success("Post deleted");
        emit("postDeleted");
      } catch {
        root.$toasted.error("Error deleting post");
      }
    };

    const verifyPost = async () => {
      try {
        await postService.verify(props.post.id);
        root.$toasted.success("Post verified!");
        emit("post-verified");
      } catch {
        root.$toasted.error("An error occured");
      }
    };

    const unverifyPost = async () => {
      try {
        await postService.unverify(props.post.id);
        root.$toasted.success("Post unverified");
        emit("post-unverified");
      } catch {
        root.$toasted.error("An error occured");
      }
    };

    const toggleLike = async () => {
      if (props.post.isLiked) {
        // optimistic update
        emit("post-unliked");
        // like
        try {
          await postService.unlike(props.post.id);
        } catch {
          root.$toasted.error("An error occured");
          emit("post-liked");
        }
      } else {
        // optimistic update
        emit("post-liked");
        // like
        try {
          await postService.like(props.post.id);
        } catch {
          root.$toasted.error("An error occured");
          emit("post-unliked");
        }
      }
    };

    return {
      date,
      byCurrentUser,
      currentUser,
      isModOrAbove,
      deletePost,
      verifyPost,
      unverifyPost,
      toggleLike
    };
  }
});
</script>
