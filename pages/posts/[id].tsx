import { GetStaticPropsContext, InferGetStaticPropsType, GetStaticPaths } from "next";
import { Article, BlogpostImage } from "@components/Article";
import type { Post } from "../index";
import Head from "next/head";

export default function BlogPost({post} : InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Article>
            <Head>
                <title>{post.title}</title>
                <meta property="og:title" content={post.title} />
            </Head>
            <h1>{post.title}</h1>
            <BlogpostImage src="/giphy.gif" />
            <p>{post.body}</p>
        </Article>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");

    const posts: Post[] = await res.json();

    const paths = posts.map((post) => ({
        params: {id: post.id.toString()}
    }));

    return {
        paths,
        fallback: false,
    }
}

export const getStaticProps = async (context : GetStaticPropsContext) => {
    const {params} = context;
    // posts/1 -> params.id ===1

    const emptyPost: Post = {
        title: "Post not found",
        body: "",
        id:0,
        userId:0,
    }

    if (!params?.id) {
        return {
            props: {
                post: emptyPost,
            }
        }
    }

    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);

    const post: Post = await res.json();

    return {
        props: {
            post,
        }
    }
}