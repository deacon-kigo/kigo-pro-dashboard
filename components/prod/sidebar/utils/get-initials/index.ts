const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstInitial = parts[0]?.charAt(0) ?? "";
  const lastInitial = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? "") : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export { getInitials };
