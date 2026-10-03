"use client";

/* eslint-disable @next/next/no-img-element */
import { Fragment, type ReactNode } from "react";
import type { ArticleBlock, InlineToken } from "./articleContent";

/**
 * Renders the whitelisted inline AST produced by `articleContent.ts`.
 * Keeping this as React nodes (rather than innerHTML) means author-supplied
 * markup can never inject markup we haven't explicitly allowed.
 */
function renderInline(tokens: InlineToken[]): ReactNode {
  return tokens.map((token, i) => {
    switch (token.type) {
      case "text":
        return <Fragment key={i}>{token.value}</Fragment>;
      case "strong":
        return (
          <strong
            key={i}
            className="font-semibold text-[#1F3A32] dark:text-[#F7F4EE]"
          >
            {renderInline(token.children)}
          </strong>
        );
      case "em":
        return (
          <em key={i} className="italic">
            {renderInline(token.children)}
          </em>
        );
      case "code":
        return (
          <code
            key={i}
            className="rounded-sm bg-[#1F3A32]/8 px-[6px] py-[2px] font-mono text-[0.9em] text-[#8A6A2F] dark:bg-white/10 dark:text-[#D2AE62]"
          >
            {token.value}
          </code>
        );
      case "link": {
        const external = /^https?:\/\//i.test(token.href);
        return (
          <a
            key={i}
            href={token.href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="text-[#8A6A2F] underline decoration-[#B08D4A] decoration-1 underline-offset-[3px] transition-colors hover:text-[#1F3A32] hover:decoration-[#B08D4A] dark:text-[#D2AE62] dark:hover:text-[#F0D9A6]"
          >
            {renderInline(token.children)}
          </a>
        );
      }
      case "image":
        return (
          <img
            key={i}
            src={token.src}
            alt={token.alt}
            loading="lazy"
            decoding="async"
            className="my-[26px] block h-auto w-full rounded-sm shadow-[0_18px_36px_-28px_rgba(31,58,50,.55)]"
          />
        );
      default:
        return null;
    }
  });
}

interface ArticleBodyProps {
  blocks: ArticleBlock[];
  /** First paragraph gets a drop cap — pass false to keep it plain. */
  dropCap?: boolean;
}

/** Index of the first paragraph — the only one that receives the drop cap. */
function firstParagraphIndex(blocks: ArticleBlock[]): number {
  return blocks.findIndex((block) => block.kind === "p");
}

export default function ArticleBody({
  blocks,
  dropCap = true,
}: ArticleBodyProps) {
  const dropCapIndex = dropCap ? firstParagraphIndex(blocks) : -1;

  return (
    <div className="text-[15.5px] leading-[1.85] text-[#1F3A32]/80 sm:text-[17px] dark:text-[#E4E9DD]/80">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                className="mt-[42px] mb-[14px] scroll-mt-[calc(var(--navbar-height)+24px)] font-serif text-[24px] leading-[1.2] font-medium text-[#1F3A32] sm:text-[28px] dark:text-[#F7F4EE]"
              >
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={i}
                id={block.id}
                className="mt-[30px] mb-[10px] scroll-mt-[calc(var(--navbar-height)+24px)] font-serif text-[19px] leading-[1.3] font-medium text-[#1F3A32] sm:text-[21px] dark:text-[#F7F4EE]"
              >
                {block.text}
              </h3>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="relative my-[30px] border-l-2 border-[#B08D4A] bg-[#F7F4EE] py-[18px] pr-[20px] pl-[22px] font-serif text-[18px] leading-[1.7] text-[#1F3A32] italic sm:text-[20px] dark:bg-[#1C2B26] dark:text-[#E4E9DD]"
              >
                {renderInline(block.tokens)}
              </blockquote>
            );

          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={i}
                className={`my-[22px] list-none space-y-[10px] pl-0 ${
                  block.ordered ? "counter-reset" : ""
                }`}
              >
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className={
                      block.ordered
                        ? "list-item relative pl-[36px] before:absolute before:left-0 before:top-[1px] before:font-serif before:text-[16px] before:text-[#8A6A2F] before:content-[counter(list-item)] dark:before:text-[#D2AE62]"
                        : "relative pl-[26px] before:absolute before:left-[6px] before:top-[0.72em] before:h-[6px] before:w-[6px] before:rounded-full before:bg-[#B08D4A] before:content-['']"
                    }
                  >
                    {renderInline(item)}
                  </li>
                ))}
              </ListTag>
            );
          }

          case "image":
            return (
              <figure
                key={i}
                className="my-[30px] overflow-hidden rounded-sm bg-[#F7F4EE] p-2 shadow-[0_20px_40px_-26px_rgba(31,58,50,.55)] dark:bg-[#1C2B26]"
              >
                <img
                  src={block.src}
                  alt={block.alt}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-cover"
                />
                {block.alt && (
                  <figcaption className="px-2 pt-3 pb-1 text-center text-[12px] tracking-wide text-[#1F3A32]/55 dark:text-[#E4E9DD]/55">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );

          case "p":
          default:
            return (
              <p
                key={i}
                className={
                  i === dropCapIndex
                    ? "mb-[20px] first-letter:float-left first-letter:mr-[10px] first-letter:mt-[6px] first-letter:font-serif first-letter:text-[58px] first-letter:leading-[0.78] first-letter:text-[#1F3A32] first-letter:font-medium dark:first-letter:text-[#D2AE62]"
                    : "mb-[20px]"
                }
              >
                {renderInline(block.tokens)}
              </p>
            );
        }
      })}
    </div>
  );
}