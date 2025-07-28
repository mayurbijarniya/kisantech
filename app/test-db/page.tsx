"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Database, CheckCircle, XCircle, RefreshCw, AlertCircle, Server, HardDrive, Network } from "lucide-react";
import axios from "axios";

interface TestResult {
  success: boolean;
  message: string;
  connection?: {
    state: string;
    database: string;
    host: string;
    readyState: number;
  };
  operations?: {
    write: string;
    read: string;
    cleanup: string;
  };
  collections?: string[];
  error?: {
    type: string;
    message: string;
    troubleshooting: string[];
  };
  timestamp: string;
}

export default function TestDBPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/test-db");
      setTestResult(data);
    } catch (error: any) {
      setTestResult(error.response?.data || {
        success: false,
        message: "Failed to connect to test endpoint",
        error: {
          type: "API Error",
          message: error.message,
          troubleshooting: ["Check if the server is running", "Verify API endpoint is accessible"]
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />
      
      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <Database className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Database Connection Test
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Test your MongoDB Atlas connection and verify database operations
            </p>
            <Button
              onClick={runTest}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Database className="h-5 w-5 mr-2" />
                  Run Test
                </>
              )}
            </Button>
          </motion.div>

          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Main Result Card */}
              <Card className={`border-2 ${testResult.success ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {testResult.success ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                    <div>
                      <CardTitle className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                        {testResult.success ? 'Connection Successful!' : 'Connection Failed'}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {testResult.message}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Connection Details */}
              {testResult.connection && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-blue-600" />
                      Connection Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Status:</span>
                        <Badge variant={testResult.connection.state === 'connected' ? 'default' : 'destructive'}>
                          {testResult.connection.state}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Database:</span>
                        <span className="text-gray-700">{testResult.connection.database || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Host:</span>
                        <span className="text-gray-700">{testResult.connection.host || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Ready State:</span>
                        <span className="text-gray-700">{testResult.connection.readyState}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Operations Test */}
              {testResult.operations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-purple-600" />
                      Database Operations Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">{testResult.operations.write}</div>
                        <div className="font-medium">Write Operation</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">{testResult.operations.read}</div>
                        <div className="font-medium">Read Operation</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">{testResult.operations.cleanup}</div>
                        <div className="font-medium">Cleanup</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Collections */}
              {testResult.collections && testResult.collections.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-600" />
                      Available Collections ({testResult.collections.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {testResult.collections.map((collection, index) => (
                        <Badge key={index} variant="outline">
                          {collection}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Details */}
              {testResult.error && (
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      Error Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium text-red-700 mb-2">Error Type:</div>
                      <Badge variant="destructive">{testResult.error.type}</Badge>
                    </div>
                    <div>
                      <div className="font-medium text-red-700 mb-2">Error Message:</div>
                      <p className="text-red-600 bg-red-100 p-3 rounded-lg font-mono text-sm">
                        {testResult.error.message}
                      </p>
                    </div>
                    {testResult.error.troubleshooting.length > 0 && (
                      <div>
                        <div className="font-medium text-red-700 mb-2">Troubleshooting Steps:</div>
                        <ul className="list-disc list-inside space-y-1 text-red-600">
                          {testResult.error.troubleshooting.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Timestamp */}
              <div className="text-center text-sm text-gray-500">
                Test completed at: {new Date(testResult.timestamp).toLocaleString()}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}