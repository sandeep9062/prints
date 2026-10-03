"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Badge,
  Group,
  Divider,
  Skeleton,
  Button,
  Paper,
} from "@mantine/core";
import {
  useGetBlogBySlugQuery,
  useGetBlogsQuery,
} from "@/services/blogApi";
import {
  Calendar,
  User,
  ArrowLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface JournalDetailClientProps {
  slug: string;
}

// Strip HTML tags so excerpt/content renders as clean readable text.
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function JournalDetailClient({
  slug,
}: JournalDetailClientProps) {
  // 1. Fetch blog content — blog API only.
  const { data: blog, isLoading: blogLoading } = useGetBlogBySlugQuery(slug);

  // 2. Fetch related blogs (same category, excluding current).
  const { data: allBlogs = [] } = useGetBlogsQuery();

  const relatedBlogs = useMemo(() => {
    if (!allBlogs.length || !blog) return [];
    const sameCategory = allBlogs.filter(
      (b) => b._id !== blog._id && b.category === blog.category,
    );
    const rest = allBlogs.filter(
      (b) => b._id !== blog._id && b.category !== blog.category,
    );
    return [...sameCategory, ...rest].slice(0, 3);
  }, [allBlogs, blog]);

  if (blogLoading)
    return (
      <Container size="xl" py={80} px={{ base: 8, md: 12, lg: 16 }}>
        <Stack gap="lg">
          <Skeleton height={36} width={120} radius="xl" />
          <Skeleton height={48} width="80%" radius="md" />
          <Group gap="xl">
            <Skeleton height={20} width={160} radius="md" />
            <Skeleton height={20} width={160} radius="md" />
          </Group>
          <Skeleton height={400} radius="md" />
          <Stack gap="sm">
            <Skeleton height={16} width="100%" radius="md" />
            <Skeleton height={16} width="90%" radius="md" />
            <Skeleton height={16} width="85%" radius="md" />
            <Skeleton height={16} width="95%" radius="md" />
            <Skeleton height={16} width="70%" radius="md" />
          </Stack>
          <Skeleton height={48} width="100%" radius="md" />
          <Stack gap="sm">
            <Skeleton height={80} radius="md" />
            <Skeleton height={80} radius="md" />
            <Skeleton height={80} radius="md" />
          </Stack>
        </Stack>
      </Container>
    );

  if (!blog)
    return (
      <Container
        size="xl"
        py={100}
        ta="center"
        px={{ base: 8, md: 12, lg: 16 }}
      >
        <Title>Article not found</Title>
      </Container>
    );

  const paragraphs = stripHtml(blog.content)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const dateLabel =
    blog.date ||
    (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-IN") : "");

  return (
    <div className="bg-[#E4E9DD] pt-[calc(var(--navbar-height)+1rem)] dark:bg-[#16211D]">
      <Container
        size="xl"
        py={{ base: 40, sm: 64 }}
        px={{ base: 12, md: 16, lg: 24 }}
      >
        {/* Eyebrow — same voice as homepage hero */}
        <Text size="sm" c="#1F3A32" opacity={0.7} mb={12}>
          Press notes · Samlason Printing Press, Panchkula — since 1984
        </Text>
        <Button
          component={Link}
          href="/blog"
          variant="subtle"
          radius={100}
          leftSection={<ArrowLeft size={14} />}
          mb="sm"
          size="sm"
          styles={{
            root: { color: "#1F3A32", paddingLeft: 0 },
          }}
        >
          Back to press notes
        </Button>

        <Stack gap="lg">
          {blog.category && (
            <div>
              <Badge
                size="md"
                variant="filled"
                styles={{
                  root: { backgroundColor: "#1F3A32", color: "#F7F4EE" },
                }}
              >
                {blog.category}
              </Badge>
            </div>
          )}

          <Title
            order={1}
            fw={500}
            ff="serif"
            c="#1F3A32"
            style={{ lineHeight: 1.05, letterSpacing: "-0.01em" }}
            className="max-w-[20ch] text-[30px] sm:text-[40px] md:text-[52px]"
          >
            {blog.title}
          </Title>

          <Group gap="xl" c="#1F3A32" opacity={0.75}>
            <Group gap={5} wrap="nowrap">
              <Calendar size={16} color="#B08D4A" />
              <Text size="sm">{dateLabel}</Text>
            </Group>
            <Group gap={5} wrap="nowrap">
              <User size={16} color="#B08D4A" />
              <Text size="sm">
                {blog.author || "Samlason Printing Press"}
                {blog.authorRole ? ` · ${blog.authorRole}` : ""}
              </Text>
            </Group>
            {blog.readTime && (
              <Group gap={5} wrap="nowrap">
                <BookOpen size={16} color="#B08D4A" />
                <Text size="sm">{blog.readTime}</Text>
              </Group>
            )}
          </Group>

          {blog.image && (
            <div className="relative w-full overflow-hidden rounded-sm bg-[#F7F4EE] p-3 shadow-[0_20px_40px_-26px_rgba(31,58,50,.55)]">
              <div className="overflow-hidden bg-[#D5DCCB]">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="block h-auto w-full object-cover"
                />
              </div>
              {/* Double gold rule — stationery card frame */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 border border-[#B08D4A]/60"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-4 border border-[#B08D4A]/30"
              />
            </div>
          )}

          {blog.excerpt && (
            <Text
              size="lg"
              fw={400}
              ff="serif"
              fs="italic"
              c="#1F3A32"
              className="border-l-2 border-[#B08D4A] pl-5 text-xl leading-relaxed"
            >
              {stripHtml(blog.excerpt)}
            </Text>
          )}

          <div className="w-full max-w-none">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="my-3 text-base leading-[1.75] text-[#1F3A32]/80 sm:my-4 sm:text-lg"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Atelier strip — mirrors homepage About/Atelier trust copy */}
          <Paper
            p="xl"
            radius={2}
            mt={20}
            style={{
              backgroundColor: "#F7F4EE",
              borderTop: "2px solid #B08D4A",
              boxShadow: "0 20px 40px -26px rgba(31,58,50,.55)",
            }}
          >
            <Text size="sm" c="#1F3A32" opacity={0.7}>
              Printed slowly in Panchkula
            </Text>
            <Text fw={500} ff="serif" size="xl" c="#1F3A32" mt={6}>
              Every suite is proofed on real paper — no middlemen, no
              compromise.
            </Text>
            <Group gap="sm" mt="md">
              <Button
                component={Link}
                href="/customize"
                size="md"
                radius="xl"
                styles={{
                  root: { backgroundColor: "#1F3A32", color: "#F7F4EE" },
                }}
              >
                Begin customization
              </Button>
              <Button
                component={Link}
                href="/products"
                size="md"
                radius="xl"
                variant="outline"
                styles={{
                  root: { borderColor: "#1F3A32", color: "#1F3A32" },
                }}
              >
                Explore the collection
              </Button>
            </Group>
          </Paper>

        {/* Related press notes — bone cards */}
        {relatedBlogs.length > 0 && (
          <>
            <Divider
              my={40}
              label="Related press notes"
              labelPosition="center"
              styles={{ label: { color: "#1F3A32" } }}
            />
            <Stack gap="sm">
              {relatedBlogs.map((b) => (
                <Paper
                  key={b._id}
                  component={Link}
                  href={`/blog/${b.slug}`}
                  p="md"
                  radius={2}
                  style={{
                    backgroundColor: "#F7F4EE",
                    border: "1px solid rgba(31,58,50,.15)",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                      <Text fw={500} ff="serif" size="md" c="#1F3A32" lineClamp={1}>
                        {b.title}
                      </Text>
                      <Group gap="xs" wrap="wrap">
                        {b.category && (
                          <Badge
                            size="sm"
                            variant="light"
                            styles={{
                              root: {
                                backgroundColor: "rgba(176,141,74,.15)",
                                color: "#8A6A2F",
                              },
                            }}
                          >
                            {b.category}
                          </Badge>
                        )}
                        <Text size="xs" c="#1F3A32" opacity={0.65}>
                          {b.date}
                        </Text>
                      </Group>
                    </Stack>
                    <ChevronRight size={16} color="#B08D4A" />
                  </Group>
                </Paper>
              ))}
            </Stack>
          </>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <>
            <Divider
              my={30}
              label="Filed under"
              labelPosition="center"
              styles={{ label: { color: "#1F3A32" } }}
            />
            <Group gap="xs" justify="center" wrap="wrap">
              {blog.tags.map((tag: string, idx: number) => (
                <Badge
                  key={idx}
                  size="lg"
                  variant="outline"
                  radius="xl"
                  styles={{
                    root: { borderColor: "#B08D4A", color: "#8A6A2F" },
                  }}
                  className="px-[10px] py-[4px] text-[11px] sm:px-[14px] sm:py-[6px] sm:text-[12px]"
                >
                  #{tag}
                </Badge>
              ))}
            </Group>
          </>
        )}
        {/* CTA card on the desk — mirrors homepage CTASection */}
        <div className="relative overflow-hidden rounded-sm bg-[#1F3A32] p-8 text-center sm:p-10">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 border border-[#D2AE62]/60"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 border border-[#D2AE62]/30"
          />
          <BookOpen size={28} color="#D2AE62" className="mx-auto" />
          <Title
            order={3}
            mt="md"
            ff="serif"
            fw={500}
            c="#F7F4EE"
            className="text-xl sm:text-2xl"
          >
            Your vision, <span className="italic">exquisitely</span> rendered.
          </Title>
          <Text mb="xl" mt="sm" size="sm" c="#E4E9DD" opacity={0.85}>
            From sketch to final emboss — begin your design consultation today,
            or browse 100+ original stationery designs.
          </Text>
          <Group gap="sm" justify="center">
            <Button
              size="md"
              radius="xl"
              component={Link}
              href="/customize"
              styles={{
                root: { backgroundColor: "#F7F4EE", color: "#1F3A32" },
              }}
              className="w-full sm:w-auto"
            >
              Begin customization
            </Button>
            <Button
              size="md"
              radius="xl"
              variant="outline"
              component={Link}
              href="/blog"
              styles={{
                root: { borderColor: "#D2AE62", color: "#F7F4EE" },
              }}
              className="w-full sm:w-auto"
            >
              Explore all press notes
            </Button>
          </Group>
        </div>
      </Stack>
      </Container>
    </div>
  );
}
