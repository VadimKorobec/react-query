import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "../../util/http";

import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "../Events/EventItem";

export default function FindEventSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const searchElement = useRef();

 

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events",  searchTerm],
    queryFn: () => fetchEvent(searchTerm),
  });

  

  function handleSubmit(event) {
    event.preventDefault();
    if (searchElement.current) {
      setSearchTerm(searchElement.current.value);
    }
    
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occured"
        message={error.info?.message || "Failed to fetch event"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
