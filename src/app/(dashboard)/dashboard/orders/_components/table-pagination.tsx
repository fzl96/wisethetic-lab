import { getOrdersPage } from "@/server/api/orders/queries";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronsRight, ChevronsLeft } from "lucide-react";

interface TablePaginationProps {
  page: number;
}

export async function TablePagination({ page }: TablePaginationProps) {
  const totalPages = await getOrdersPage();
  console.log(totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            aria-label="Go to first page"
            className="gap-1 pr-2.5"
            size="default"
            href={`/dashboard?page=1`}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span>First</span>
          </PaginationLink>
        </PaginationItem>
        {page > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious href={`/dashboard?page=${page - 1}`} />
            </PaginationItem>

            {page > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                isActive={false}
                href={`/dashboard?page=${page - 1}`}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationLink isActive={true} href={`/dashboard?page=${page}`}>
            {page}
          </PaginationLink>
        </PaginationItem>

        {page < totalPages && (
          <>
            <PaginationItem>
              <PaginationLink href={`/dashboard?page=${page + 1}`}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>

            {page < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext href={`/dashboard?page=${page + 1}`} />
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationLink
            aria-label="Go to last page"
            size="default"
            className="gap-1 pr-2.5"
            href={`/dashboard?page=${totalPages}`}
          >
            <span>Last</span>
            <ChevronsRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
