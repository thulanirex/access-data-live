import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, CheckCircle, Smartphone } from "lucide-react";
import { format } from 'date-fns';

interface SecuritySummary {
    REGISTERED_DEVICES: number;
    LAST_PASSWORD_CHANGE: string;
    SECURITY_STATUS: string;
    RECOMMENDATIONS: string;
}

interface ActivitySummary {
    DAYS_SINCE_LAST_LOGIN: number;
    PREFERRED_CHANNEL: string;
    ACTIVITY_LEVEL: string;
    LAST_LOGIN_FORMATTED: string;
    CURRENT_LOGIN_FORMATTED: string;
}

interface ChannelActivity {
    MOBILE_BANKING_REGISTERED: boolean;
    TENGA_REGISTERED: boolean;
    CHANNEL_TYPE: string;
    STATUS_DESCRIPTION: string;
    LAST_ACTIVE_DATE: string;
}

export interface MobileProfile {
    CIF: string;
    CNAME: string;
    NATIONAL_ID: string;
    MOBILE: string;
    MADE_AT: string;
    MAKER_LAST_CMT: string;
    CHECKER_LAST_CMT: string;
    CREATED_AT: string;
    MODIFIED_AT: string;
    ALLOWED_PHONE_ID1: string;
    MB_LAST_LOGIN: string;
    MB_CURR_LOGIN: string;
    MB_LAST_CHANNEL: string;
    MB_CURR_CHANNEL: string;
    MPINSETDATE: string;
    IMSI: string;
    SECURITY_SUMMARY: SecuritySummary;
    ACTIVITY_SUMMARY: ActivitySummary;
    CHANNEL_ACTIVITY: ChannelActivity;
}

interface MobileProfileTabProps {
    mobileProfile: MobileProfile | null;
    loading: boolean;
    error: string | null;
}

const formatDate = (dateString: string) => {
    try {
        if (!dateString) return 'N/A';
        
        // Parse the date string
        const date = new Date(dateString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) return dateString;
        
        // Format the date
        return format(date, 'dd MMM yyyy HH:mm:ss');
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

const formatMPINDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    // Format from "20241217104959" to "2024-12-17 10:49:59"
    try {
        const formatted = dateString.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1-$2-$3 $4:$5:$6');
        return formatDate(formatted);
    } catch (error) {
        console.error('Error formatting MPIN date:', error);
        return dateString;
    }
};

const MobileProfileTab: React.FC<MobileProfileTabProps> = ({ mobileProfile, loading, error }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2">Loading mobile banking profile...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
                Error loading mobile banking profile: {error}
            </div>
        );
    }

    if (!mobileProfile) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Smartphone className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">No Mobile Banking Profile</h3>
                <p className="text-muted-foreground max-w-md">
                    This customer does not have a mobile banking profile or it could not be retrieved.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                        <h3 className="font-medium text-lg mb-2">Mobile Banking Profile</h3>
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Customer Name:</span>
                                <span className="col-span-2 font-medium">{mobileProfile.CNAME}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">CIF:</span>
                                <span className="col-span-2">{mobileProfile.CIF}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">National ID:</span>
                                <span className="col-span-2">{mobileProfile.NATIONAL_ID}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Mobile Number:</span>
                                <span className="col-span-2">{mobileProfile.MOBILE}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Registration Date:</span>
                                <span className="col-span-2">{formatDate(mobileProfile.CREATED_AT)}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Last Modified:</span>
                                <span className="col-span-2">{formatDate(mobileProfile.MODIFIED_AT)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-md">
                        <h3 className="font-medium text-lg mb-2">Security Information</h3>
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Security Status:</span>
                                <span className="col-span-2">
                                    <Badge variant={mobileProfile.SECURITY_SUMMARY.SECURITY_STATUS === 'Normal' ? 'default' : 'destructive'}>
                                        {mobileProfile.SECURITY_SUMMARY.SECURITY_STATUS}
                                    </Badge>
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Registered Devices:</span>
                                <span className="col-span-2">{mobileProfile.SECURITY_SUMMARY.REGISTERED_DEVICES}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Device ID:</span>
                                <span className="col-span-2 font-mono text-xs">{mobileProfile.ALLOWED_PHONE_ID1}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">IMSI:</span>
                                <span className="col-span-2 font-mono text-xs">{mobileProfile.IMSI}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Last Password Change:</span>
                                <span className="col-span-2">{mobileProfile.SECURITY_SUMMARY.LAST_PASSWORD_CHANGE}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">MPIN Set Date:</span>
                                <span className="col-span-2">
                                    {formatMPINDate(mobileProfile.MPINSETDATE)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                        <h3 className="font-medium text-lg mb-2">Activity Summary</h3>
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Activity Level:</span>
                                <span className="col-span-2">
                                    <Badge variant={mobileProfile.ACTIVITY_SUMMARY.ACTIVITY_LEVEL === 'Active' ? 'default' : 'secondary'}>
                                        {mobileProfile.ACTIVITY_SUMMARY.ACTIVITY_LEVEL}
                                    </Badge>
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Days Since Last Login:</span>
                                <span className="col-span-2">{mobileProfile.ACTIVITY_SUMMARY.DAYS_SINCE_LAST_LOGIN}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Preferred Channel:</span>
                                <span className="col-span-2">{mobileProfile.ACTIVITY_SUMMARY.PREFERRED_CHANNEL}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Last Login:</span>
                                <span className="col-span-2">{mobileProfile.ACTIVITY_SUMMARY.LAST_LOGIN_FORMATTED}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Current Login:</span>
                                <span className="col-span-2">{mobileProfile.ACTIVITY_SUMMARY.CURRENT_LOGIN_FORMATTED}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-md">
                        <h3 className="font-medium text-lg mb-2">Channel Information</h3>
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Channel Type:</span>
                                <span className="col-span-2">{mobileProfile.CHANNEL_ACTIVITY.CHANNEL_TYPE}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Mobile Banking:</span>
                                <span className="col-span-2 flex items-center">
                                    {mobileProfile.CHANNEL_ACTIVITY.MOBILE_BANKING_REGISTERED ? 
                                        <><CheckCircle className="h-4 w-4 text-green-500 mr-1" /> Registered</> : 
                                        <><AlertTriangle className="h-4 w-4 text-amber-500 mr-1" /> Not Registered</>}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Tenga:</span>
                                <span className="col-span-2 flex items-center">
                                    {mobileProfile.CHANNEL_ACTIVITY.TENGA_REGISTERED ? 
                                        <><CheckCircle className="h-4 w-4 text-green-500 mr-1" /> Registered</> : 
                                        <><AlertTriangle className="h-4 w-4 text-amber-500 mr-1" /> Not Registered</>}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Last Active Date:</span>
                                <span className="col-span-2">{mobileProfile.CHANNEL_ACTIVITY.LAST_ACTIVE_DATE}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-900">
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-1">Security Recommendations</h3>
                                <p className="text-amber-700 dark:text-amber-400 text-sm">
                                    {mobileProfile.SECURITY_SUMMARY.RECOMMENDATIONS}
                                </p>
                                {mobileProfile.SECURITY_SUMMARY.SECURITY_STATUS !== 'Normal' && (
                                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                                        <p><strong>Note:</strong> This account has security concerns that may require attention.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">Registration Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Registration Date:</span>
                                <span className="col-span-2">{formatDate(mobileProfile.MADE_AT)}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Registration Type:</span>
                                <span className="col-span-2">
                                    <Badge variant={mobileProfile.MAKER_LAST_CMT === 'Self Registration' ? 'outline' : 'secondary'}>
                                        {mobileProfile.MAKER_LAST_CMT}
                                    </Badge>
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Checker Comment:</span>
                                <span className="col-span-2">{mobileProfile.CHECKER_LAST_CMT}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Last Channel:</span>
                                <span className="col-span-2">{mobileProfile.MB_LAST_CHANNEL}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Current Channel:</span>
                                <span className="col-span-2">{mobileProfile.MB_CURR_CHANNEL}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileProfileTab;
