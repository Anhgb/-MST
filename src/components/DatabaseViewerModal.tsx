import React, { useState } from 'react';
import { dbInstance, DatabaseState } from '../database/db';
import { Database, Table, Search, Terminal, Download, RefreshCw, X, Check, Code, ShieldCheck } from 'lucide-react';

interface DatabaseViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseViewerModal: React.FC<DatabaseViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const tableNames = dbInstance.getTableNames();
  const [selectedTable, setSelectedTable] = useState<keyof DatabaseState>('orders');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM orders;');
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!isOpen) return null;

  const currentData = queryResults !== null ? queryResults : dbInstance.getTableData(selectedTable);
  const columns = currentData.length > 0 ? Object.keys(currentData[0]) : [];

  const handleRunQuery = () => {
    const res = dbInstance.executeSQLQuery(sqlQuery);
    setQueryResults(res);
  };

  const handleSelectTable = (tbl: keyof DatabaseState) => {
    setSelectedTable(tbl);
    setSqlQuery(`SELECT * FROM ${tbl};`);
    setQueryResults(null);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(dbInstance.exportJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "fixnow_ai_database_dump.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadSchemaSQL = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", "/database/schema.sql");
    downloadAnchor.setAttribute("download", "schema.sql");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetSeed = () => {
    if (confirm('Khôi phục toàn bộ 22 bảng cơ sở dữ liệu về dữ liệu ban đầu?')) {
      dbInstance.resetToSeed();
      setQueryResults(null);
      alert('Đã khôi phục dữ liệu mẫu thành công!');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(10, 25, 47, 0.9)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#0b1d30',
        borderRadius: '24px',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '94vh',
        color: '#ffffff',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 0 50px rgba(37, 99, 235, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(16, 42, 67, 0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                  FixNow AI Database Explorer & SQL Engine (PRD Mục 14)
                </h3>
                <span className="badge badge-green" style={{ fontSize: '10px' }}>
                  22 TABLES ACTIVE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Cơ sở dữ liệu quan hệ hoàn chỉnh: Người dùng, Chẩn đoán AI Camera, Báo giá cố định, Điều phối thợ & Bảo hành điện tử
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleExportJSON}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} />
              <span>Xuất JSON</span>
            </button>

            <button
              type="button"
              onClick={handleResetSeed}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} />
              <span>Reset Dữ Liệu</span>
            </button>

            <button
              onClick={onClose}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cbd5e1'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body: Tables Sidebar (Left) + SQL / Table Viewer (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* Tables List */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#60a5fa', padding: '0 8px 8px', letterSpacing: '0.5px' }}>
              DANH SÁCH 22 BẢNG (PRD 616-665):
            </span>
            {tableNames.map((tbl) => {
              const count = dbInstance.getTableData(tbl).length;
              const isSelected = selectedTable === tbl && queryResults === null;
              return (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => handleSelectTable(tbl)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    background: isSelected ? 'rgba(37, 99, 235, 0.35)' : 'transparent',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid transparent',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Table size={14} color={isSelected ? '#60a5fa' : '#64748b'} />
                    <span>{tbl}</span>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '1px 6px',
                    borderRadius: '4px'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Main Viewer */}
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* SQL Terminal Bar */}
            <div style={{
              padding: '14px 20px',
              background: 'rgba(16, 42, 67, 0.5)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="SELECT * FROM orders; hoặc SELECT * FROM quotes WHERE is_locked = true;"
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid #3b82f6',
                    color: '#4ade80',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <Terminal size={16} color="#60a5fa" style={{ position: 'absolute', left: '10px', top: '11px' }} />
              </div>

              <button
                type="button"
                onClick={handleRunQuery}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                Chạy SQL
              </button>
            </div>

            {/* Quick Query Pills */}
            <div style={{
              padding: '8px 20px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto'
            }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                Truy vấn nhanh:
              </span>
              {[
                'SELECT * FROM ai_diagnoses;',
                'SELECT * FROM quotes;',
                'SELECT * FROM orders;',
                'SELECT * FROM service_price_items;',
                'SELECT * FROM warranties;'
              ].map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSqlQuery(q);
                    const tbl = q.split('FROM')[1]?.trim().replace(';', '') as keyof DatabaseState;
                    if (tbl) setSelectedTable(tbl);
                    setQueryResults(dbInstance.executeSQLQuery(q));
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#93c5fd',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Table Records Grid */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#93c5fd', fontFamily: 'monospace' }}>
                  Bảng đang hiển thị: <strong>{selectedTable}</strong> ({currentData.length} bản ghi)
                </span>
                <span style={{ fontSize: '11px', color: '#4ade80' }}>
                  ● Dữ liệu đồng bộ theo thời gian thực
                </span>
              </div>

              {currentData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                  <p>Bảng này chưa có bản ghi nào.</p>
                </div>
              ) : (
                <div style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(0, 0, 0, 0.3)'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace' }}>
                    <thead>
                      <tr style={{ background: 'rgba(37, 99, 235, 0.25)', color: '#60a5fa', textAlign: 'left' }}>
                        {columns.map(col => (
                          <th key={col} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          {columns.map(col => {
                            const val = row[col];
                            return (
                              <td key={col} style={{ padding: '8px 14px', color: '#e2e8f0' }}>
                                {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
