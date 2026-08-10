// Small hand-rolled icon set — keeps us from pulling in an icon library.
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const CalendarIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

export const MapPinIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
);

export const UsersIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16.5 8.2a3.2 3.2 0 1 1 3 4.6M17.5 14c2.8.4 4 2.2 4 6" />
  </svg>
);

export const SparklesIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    <path d="M12 8.5 13.2 11l2.5 1.2-2.5 1.2L12 15.9l-1.2-2.5L8.3 12.2l2.5-1.2Z" />
  </svg>
);

export const PlusIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const TrashIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

export const EditIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
  </svg>
);

export const LogOutIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const ChevronRightIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ShieldIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
  </svg>
);

export const TicketIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3V9Z" />
    <path d="M9 7v10" strokeDasharray="2 3" />
  </svg>
);

export const MailIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const LockIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export const AlertTriangleIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M10.3 3.9 2 18a1 1 0 0 0 .9 1.5h18.2A1 1 0 0 0 22 18L13.7 3.9a1 1 0 0 0-1.7 0Z" />
    <path d="M12 9.5v4M12 16.5h.01" />
  </svg>
);

export const SearchIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
