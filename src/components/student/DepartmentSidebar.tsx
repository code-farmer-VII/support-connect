import { Department, DEPARTMENTS, Ticket, User } from '@/types';

interface DepartmentSidebarProps {
  departments: Department[];
  tickets: Ticket[];
  selectedDepartment: Department | null;
  onSelectDepartment: (department: Department) => void;
  onNewTicket: () => void;
  user: User;
  onLogout: () => void;
}

export const DepartmentSidebar = ({
  departments,
  tickets,
  selectedDepartment,
  onSelectDepartment,
  onNewTicket,
  user,
  onLogout
}: DepartmentSidebarProps) => {
  const getDepartmentTicketCount = (dept: Department) => {
    return tickets.filter(t => t.department === dept && t.status !== 'resolved').length;
  };

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-sidebar-foreground">Support</h1>
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
          <p>{user.email}</p>
        </div>
      </div>

      {/* New Ticket Button */}
      <div className="p-4 border-b border-sidebar-border">
        <button
          onClick={onNewTicket}
          className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-lg transition-smooth flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>

      {/* Departments List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Departments
        </h2>
        <div className="space-y-2">
          {departments.map(dept => {
            const count = getDepartmentTicketCount(dept);
            const isSelected = selectedDepartment === dept;

            return (
              <button
                key={dept}
                onClick={() => onSelectDepartment(dept)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-smooth ${
                  isSelected
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{DEPARTMENTS[dept].name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {DEPARTMENTS[dept].description}
                    </p>
                  </div>
                  {count > 0 && (
                    <div className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      {count}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
