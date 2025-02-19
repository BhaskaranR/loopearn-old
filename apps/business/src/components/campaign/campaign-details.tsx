"use client";

import { Badge } from "@loopearn/ui/badge";
import { Button } from "@loopearn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@loopearn/ui/card";
import { Checkbox } from "@loopearn/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@loopearn/ui/dropdown-menu";
import { Facebook } from "@loopearn/ui/icons";
import { Input } from "@loopearn/ui/input";
import { Label } from "@loopearn/ui/label";
import { Textarea } from "@loopearn/ui/textarea";
import { MoreVertical } from "lucide-react";

export default function CampaignDetails() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="name"
                defaultValue="Facebook Friend"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <div className="flex items-center space-x-2">
              <Textarea
                id="description"
                defaultValue="Share us on facebook to receive a special reward for"
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="redirect" />
            <Label htmlFor="redirect">Add a redirection button</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reward & Badge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Reward</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Badge
                  variant="gray"
                  className="h-8 w-8 flex items-center justify-center"
                >
                  0
                </Badge>
                <span>points</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Badge</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Facebook className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">
              Give your customers a badge when they earn this campaign
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
