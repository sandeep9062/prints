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
            className="font-semibold text-foreground"
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
            className="rounded-sm bg-foreground/8 px-[6px] py-[2px] font-mono text-[0.9em] text-gold-text dark:text-gold"
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
            className="text-gold-text underline decoration-gold decoration-1 underline-offset-[3px] transition-colors hover:text-foreground hover:decoration-gold dark:text-gold dark:hover:text-gold-text"
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
    <div className="text-[15.5px] leading-[1.85] text-foreground/80 sm:text-[17px]">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                className="mt-[42px] mb-[14px] scroll-mt-[calc(var(--navbar-height)+24px)] font-sans text-[24px] leading-[1.2] font-medium text-foreground sm:text-[28px]"
              >
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={i}
                id={block.id}
                className="mt-[30px] mb-[10px] scroll-mt-[calc(var(--navbar-height)+24px)] font-sans text-[19px] leading-[1.3] font-medium text-foreground sm:text-[21px]"
              >
                {block.text}
              </h3>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="relative my-[30px] border-l-2 border-gold bg-ivory py-[18px] pr-[20px] pl-[22px] font-sans text-[18px] leading-[1.7] text-foreground italic sm:text-[20px]"
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
                        ? "list-item relative pl-[36px] before:absolute before:left-0 before:top-[1px] before:font-sans before:text-[16px] before:text-gold-text before:content-[counter(list-item)] dark:before:text-gold"
                        : "relative pl-[26px] before:absolute before:left-[6px] before:top-[0.72em] before:h-[6px] before:w-[6px] before:rounded-full before:bg-gold before:content-['']"
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
                className="my-[30px] overflow-hidden rounded-sm bg-ivory p-2 shadow-[0_20px_40px_-26px_rgba(31,58,50,.55)]"
              >
                <img
                  src={block.src}
                  alt={block.alt}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-cover"
                />
                {block.alt && (
                  <figcaption className="px-2 pt-3 pb-1 text-center text-[12px] tracking-wide text-foreground/70">
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
                    ? "mb-[20px] first-letter:float-left first-letter:mr-[10px] first-letter:mt-[6px] first-letter:font-serif first-letter:text-[58px] first-letter:leading-[0.78] first-letter:text-foreground first-letter:font-medium dark:first-letter:text-gold"
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