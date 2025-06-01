import { useState } from 'react';
import { Clock, Download, FileCheck, FilePlus, FileX, Filter, Info, Upload, X } from 'lucide-react';

const Documents = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Mock data
  const documents = [
    { 
      id: 1, 
      name: 'ID Card', 
      type: 'Identity', 
      uploadDate: '2025-01-15', 
      expiryDate: '2026-01-15', 
      status: 'Verified',
      fileUrl: '#'
    },
    { 
      id: 2, 
      name: 'Certification', 
      type: 'Professional', 
      uploadDate: '2025-03-10', 
      expiryDate: '2027-03-10', 
      status: 'Pending',
      fileUrl: '#'
    },
    { 
      id: 3, 
      name: 'Health Insurance', 
      type: 'Insurance', 
      uploadDate: '2024-11-05', 
      expiryDate: '2025-11-05', 
      status: 'Verified',
      fileUrl: '#'
    },
    { 
      id: 4, 
      name: 'Address Proof', 
      type: 'Identity', 
      uploadDate: '2025-04-20', 
      expiryDate: null, 
      status: 'Rejected',
      fileUrl: '#'
    },
    { 
      id: 5, 
      name: 'Employment Contract', 
      type: 'Employment', 
      uploadDate: '2025-02-01', 
      expiryDate: null, 
      status: 'Verified',
      fileUrl: '#'
    },
  ];
  
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'Identity',
    file: null as File | null,
    expiryDate: '',
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally upload the file
    setShowUploadForm(false);
    // Reset form
    setUploadForm({
      name: '',
      type: 'Identity',
      file: null,
      expiryDate: '',
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <FileCheck size={18} className="text-green-500" />;
      case 'Pending':
        return <Clock size={18} className="text-yellow-500" />;
      case 'Rejected':
        return <FileX size={18} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 && diffDays <= 30;
  };
  
  const filteredDocuments = selectedFilter === 'all' 
    ? documents 
    : documents.filter(doc => doc.status.toLowerCase() === selectedFilter);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Documents Center</h1>
        <button
          onClick={() => setShowUploadForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FilePlus size={16} />
          <span>Upload Document</span>
        </button>
      </div>
      
      <div className="card mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
        <div className="flex">
          <Info size={20} className="text-blue-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300">Document Verification</h3>
            <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
              All uploaded documents will be verified by the HR department within 2 business days.
              You will be notified once the verification is complete.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Filter size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Filter:</span>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Documents</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {doc.name}
                    {isExpiringSoon(doc.expiryDate) && (
                      <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                        Expiring Soon
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(doc.status)}`}>
                      {getStatusIcon(doc.status)}
                      <span className="ml-1">{doc.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a 
                      href={doc.fileUrl} 
                      className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                    >
                      <Download size={18} />
                    </a>
                    <button 
                      onClick={() => setShowUploadForm(true)} 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      <Upload size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showUploadForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Upload Document</h2>
              <button 
                onClick={() => setShowUploadForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={uploadForm.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Type
                </label>
                <select
                  name="type"
                  value={uploadForm.type}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                >
                  <option value="Identity">Identity</option>
                  <option value="Professional">Professional</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Employment">Employment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document File
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 w-full h-32 p-10 group text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="h-full w-full text-center flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                      {uploadForm.file ? (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {uploadForm.file.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-gray-700 dark:text-gray-300">Drag and drop a file or click to select</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Supported formats: PDF, JPG, PNG (max 5MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date (if applicable)
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={uploadForm.expiryDate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
