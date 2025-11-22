import { Ticket, TicketStatus, User } from '@/types';

interface AdminSidebarProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket) => void;
  statusFilter: 'all' | TicketStatus;
  onStatusFilterChange: (filter: 'all' | TicketStatus) => void;
  user: User;
  onLogout: () => void;
  isLoading: boolean;
}

export const AdminSidebar = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  statusFilter,
  onStatusFilterChange,
  user,
  onLogout,
  isLoading
}: AdminSidebarProps) => {
  const getStatusCount = (status: 'all' | TicketStatus) => {
    if (status === 'all') return tickets.length;
    return tickets.filter(t => t.status === status).length;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const ticketDate = new Date(date);
    const diffMs = now.getTime() - ticketDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filters: Array<{ value: 'all' | TicketStatus; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' }
  ];

  return (
    <div className="w-96 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-sidebar-foreground">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-lg transition-smooth"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-sidebar-foreground">{user.name}</p>
          <p className="capitalize">{user.role.replace('-', ' ')} Department</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="grid grid-cols-2 gap-2">
          {filters.map(filter => {
            const count = getStatusCount(filter.value);
            const isActive = statusFilter === filter.value;

            return (
              <button
                key={filter.value}
                onClick={() => onStatusFilterChange(filter.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">{filter.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-6 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm text-muted-foreground">No tickets found</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {tickets.map(ticket => {
              const isSelected = selectedTicket?.id === ticket.id;
              const lastMessage = ticket.messages[ticket.messages.length - 1];

              return (
                <button
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-smooth ${
                    isSelected
                      ? 'bg-sidebar-accent'
                      : 'hover:bg-sidebar-accent/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate flex-1">
                      {ticket.studentName}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(ticket.updatedAt)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground/90 truncate mb-1">
                    {ticket.subject}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {lastMessage?.content}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
