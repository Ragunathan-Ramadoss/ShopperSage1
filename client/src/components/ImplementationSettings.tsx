import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function ImplementationSettings() {
  const [environment, setEnvironment] = useState("production");
  const [rateLimit, setRateLimit] = useState("100");
  const [cacheExpiry, setCacheExpiry] = useState("15");
  const [enableCrossSell, setEnableCrossSell] = useState(true);
  const [enableUpSell, setEnableUpSell] = useState(true);
  const [enableRealtime, setEnableRealtime] = useState(false);
  const [defaultLimit, setDefaultLimit] = useState("3");

  const handleSaveChanges = () => {
    // This would typically save the settings via an API call
  };

  return (
    <div className="px-6 py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Configuration */}
        <div>
          <h3 className="font-medium text-neutral-darkest dark:text-white mb-4">API Configuration</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="environment" className="block text-sm font-medium text-neutral-darkest dark:text-neutral-200 mb-1">
                Environment
              </Label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="rate-limit" className="block text-sm font-medium text-neutral-darkest dark:text-neutral-200 mb-1">
                Rate Limiting
              </Label>
              <Select value={rateLimit} onValueChange={setRateLimit}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select rate limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 requests/minute (Standard)</SelectItem>
                  <SelectItem value="500">500 requests/minute (Premium)</SelectItem>
                  <SelectItem value="1000">1000 requests/minute (Enterprise)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="cache-expiry" className="block text-sm font-medium text-neutral-darkest dark:text-neutral-200 mb-1">
                Cache Expiry
              </Label>
              <Select value={cacheExpiry} onValueChange={setCacheExpiry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cache expiry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Recommendation Settings */}
        <div>
          <h3 className="font-medium text-neutral-darkest dark:text-white mb-4">Recommendation Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="cross-selling" className="text-sm font-medium text-neutral-darkest dark:text-neutral-200">
                Enable Cross-Selling
              </Label>
              <Switch
                id="cross-selling"
                checked={enableCrossSell}
                onCheckedChange={setEnableCrossSell}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="up-selling" className="text-sm font-medium text-neutral-darkest dark:text-neutral-200">
                Enable Upselling
              </Label>
              <Switch
                id="up-selling"
                checked={enableUpSell}
                onCheckedChange={setEnableUpSell}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="realtime" className="text-sm font-medium text-neutral-darkest dark:text-neutral-200">
                Real-time Recommendations
              </Label>
              <Switch
                id="realtime"
                checked={enableRealtime}
                onCheckedChange={setEnableRealtime}
              />
            </div>
            
            <div>
              <Label htmlFor="default-limit" className="block text-sm font-medium text-neutral-darkest dark:text-neutral-200 mb-1">
                Default Recommendation Limit
              </Label>
              <Input
                id="default-limit"
                type="number"
                value={defaultLimit}
                onChange={(e) => setDefaultLimit(e.target.value)}
                className="block w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-end space-x-3">
        <Button
          variant="outline"
          type="button"
          className="text-neutral-darkest dark:text-neutral-200 bg-white dark:bg-neutral-800 border-neutral-light dark:border-neutral-700"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSaveChanges}
          className="text-white bg-primary hover:bg-primary-dark"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
