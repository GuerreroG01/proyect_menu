type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-10">
      <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl px-3 py-2">

        {pages.map((page) => {
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                min-w-[36px] h-9 px-3 rounded-xl text-sm font-bold
                transition-all duration-200 flex items-center justify-center

                ${
                  isActive
                    ? "bg-[#002B5B] text-white shadow-md scale-105"
                    : "text-[#002B5B] hover:bg-[#00A7E1]/10"
                }
              `}
            >
              {page}
            </button>
          );
        })}

      </div>
    </div>
  );
}