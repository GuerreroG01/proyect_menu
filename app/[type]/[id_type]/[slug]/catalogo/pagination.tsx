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
        <div className="flex justify-center mt-6 mb-4">
            <div className="
                flex items-center gap-1
                bg-white/70 backdrop-blur-md
                border border-[#F2D6B3]
                shadow-sm
                rounded-2xl
                px-3 py-2
            ">

                {pages.map((page) => {
                const isActive = page === currentPage;

                return (
                    <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`
                        min-w-[38px] h-9 px-3
                        rounded-xl
                        text-xs font-black
                        transition-all duration-200
                        flex items-center justify-center
                        tracking-wide

                        ${
                        isActive
                            ? "bg-[#C97B2A] text-white shadow-md scale-105"
                            : "text-[#3A2E2A] hover:bg-[#FFF3E6] hover:scale-105"
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