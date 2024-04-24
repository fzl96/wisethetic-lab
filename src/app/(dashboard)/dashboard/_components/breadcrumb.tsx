"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { reverseSlug } from "@/lib/utils";

export function BreadCrumb() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((path) => path);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathnames.map((path, index) => {
          const href =
            path === "dashboard" ? "/dashboard" : `/dashboard/${path}`;
          const linkName = path[0]?.toUpperCase() + path.slice(1, path.length);
          const name = reverseSlug(linkName);
          const isLast = pathnames.length === index + 1;
          return (
            <Fragment key={path}>
              <BreadcrumbItem>
                {!isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{linkName}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function Fragment({ children }: { children: React.ReactNode }) {
  return children;
}
