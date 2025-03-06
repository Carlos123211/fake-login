import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

interface Item {
  id: number;
  title: string;
}

const Home = () => {
  const { logout } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    api.get<Item[]>("/photos")
      .then(response => {
        setItems(response.data.slice(0, 2000));
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    let pages = [];
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    pages.push(
      <button key={1} onClick={() => goToPage(1)} disabled={currentPage === 1}>1</button>
    );

    if (startPage > 2) {
      pages.push(<span key="start-dots">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          disabled={currentPage === i}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(<span key="end-dots">...</span>);
    }

    pages.push(
      <button key={totalPages} onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
        {totalPages}
      </button>
    );

    return pages;
  };

  return (
    <div className="container">
      <div className="header__Title">
      <h2>Home</h2>
      <button onClick={logout}>Logout</button>
      </div>
      
      <div>
        <label>Items per page: </label>
        <select value={itemsPerPage} onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      {loading ? <p>Loading...</p> : (
        <>
          <ul>
            {currentItems.map(item => (
              <li className="text-left" key={item.id}>{item.title}</li>
            ))}
          </ul>
          <div className="pagination">
            <button onClick={() => goToPage(1)} disabled={currentPage === 1}>&lt;&lt;</button>
            {renderPagination()}
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>&gt;&gt;</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;